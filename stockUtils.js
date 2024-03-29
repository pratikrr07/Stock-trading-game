const fetch = require('node-fetch');
const Player = require('./models/player');

// Fetches the current stock price from Alpha Vantage API
async function getStockPrice(symbol) {
    const apiKey = 'JCM49K1U60I0BBMM'; // API key for Alpha Vantage
    const functionType = 'GLOBAL_QUOTE';
    const baseURL = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error(`Failed to fetch stock price for ${symbol}`);
        const data = await response.json();
        const price = data["Global Quote"]["05. price"];
        return parseFloat(price); // Ensure the price is returned as a float
    } catch (error) {
        console.error(`Error fetching stock price for ${symbol}:`, error);
        throw error;
    }
}

// Fetches current prices for multiple stocks
async function getCurrentPrices(symbols) {
    const prices = {};
    for (let symbol of symbols) {
        try {
            const price = await getStockPrice(symbol);
            prices[symbol] = price;
        } catch (error) {
            console.error(`Error fetching price for ${symbol}: `, error);
            prices[symbol] = null; // Mark as null if fetching fails
        }
    }
    return prices;  
}

// Fetches stock performance to analyze market trends
async function fetchStockPerformance(symbol) {
    const apiKey = 'JCM49K1U60I0BBMM';
    const functionType = 'TIME_SERIES_DAILY';
    const baseURL = `https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=${apiKey}`;

    try {
        const response = await fetch(baseURL);
        if (!response.ok) throw new Error(`Failed to fetch data for ${symbol}`);
        const data = await response.json();
        const timeSeries = data["Time Series (Daily)"];
        const dates = Object.keys(timeSeries).sort().reverse();
        
        if (dates.length < 2) throw new Error('Not enough data to analyze trends');

        const latestPrice = parseFloat(timeSeries[dates[0]]["4. close"]);
        const previousPrice = parseFloat(timeSeries[dates[1]]["4. close"]);
        
        // Return an object containing the symbol, latest price, previous price, and trend direction
        return {
            symbol,
            latestPrice,
            previousPrice,
            trend: latestPrice > previousPrice ? 'up' : 'down',
        };
    } catch (error) {
        console.error(`Error fetching stock performance for ${symbol}:`, error);
        throw error;
    }
}

// Analyzes market trends for a list of symbols
async function analyzeMarketTrends(symbols) {
    const trendAnalysis = [];

    for (let symbol of symbols) {
        try {
            const performance = await fetchStockPerformance(symbol);
            trendAnalysis.push(performance);
        } catch (error) {
            console.error(`Error analyzing trend for ${symbol}: `, error);
        }
    }

    return trendAnalysis;
}

// Adds a stock symbol to a player's watchlist
async function addToWatchlist(playerId, symbol) {
    const player = await Player.findById(playerId);
    if (!player) throw new Error('Player not found');

    // Add symbol to watchlist if it's not already there
    if (!player.watchlist.includes(symbol)) {
        player.watchlist.push(symbol);
        await player.save(); // Save changes to the database
    }
}

// Removes a stock symbol from a player's watchlist
async function removeFromWatchlist(playerId, symbol) {
    const player = await Player.findById(playerId);
    if (!player) throw new Error('Player not found');

    // Remove symbol from watchlist
    player.watchlist = player.watchlist.filter(s => s !== symbol);
    await player.save(); // Save changes to the database
}

// Gets the current prices for all stocks in a player's watchlist
async function getWatchlistPrices(playerId) {
    const player = await Player.findById(playerId);
    if (!player) throw new Error('Player not found');

    // Get current prices for all symbols in the watchlist
    const symbols = player.watchlist;
    return getCurrentPrices(symbols);
}

module.exports = {
    getStockPrice,
    getCurrentPrices,
    fetchStockPerformance,
    analyzeMarketTrends,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlistPrices,
};
