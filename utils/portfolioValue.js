const stockUtils = require('c:/Users/pratik/Downloads/project-pratikrr07/stockUtils'); // Utility to get current stock prices

async function calculatePortfolioValue(player) {
    let totalValue = player.cash; // Starting with cash on hand
    // Assuming player.stocks is an array of { symbol: 'AAPL', quantity: 10 }
    const prices = await stockUtils.getCurrentPrices(player.stocks.map(stock => stock.symbol));

    player.stocks.forEach(stock => {
        totalValue += prices[stock.symbol] * stock.quantity;
    });

    return totalValue;
}

module.exports = calculatePortfolioValue;