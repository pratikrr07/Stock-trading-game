const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const { getStockPrice, getCurrentPrices, fetchStockPerformance, analyzeMarketTrends, addToWatchlist, removeFromWatchlist, getWatchlistPrices } = require('../stockUtils');


// Register a new player
router.post('/register', async (req, res) => {
    console.log(req.body); // Debug: Log the entire request body
    if (!req.body.name) {
      return res.status(400).send('Name is required');
    }
    try {
      let player = new Player({ name: req.body.name });
      player = await player.save();
      res.status(201).send(player);
    } catch (error) {
      res.status(400).send(error.message);
    }
  });


// Endpoint for buying stocks
router.post('/:id/buy', async (req, res) => {
    const playerId = req.params.id;
    const { symbol, quantity } = req.body;

    // Validate input data
    if (quantity <= 0) {
        return res.status(400).send('Quantity must be greater than zero.');
    }

    try {
        const pricePerShare = await getStockPrice(symbol);
        const totalCost = pricePerShare * quantity;

        const player = await Player.findById(playerId);
        if (!player) {
            return res.status(404).send('Player not found.');
        }

        if (player.cash < totalCost) {
            return res.status(400).send('Insufficient funds.');
        }

        // Update player's cash and stocks
        player.cash -= totalCost;

        // Check if the player already holds stocks of the given symbol
        const existingStockIndex = player.stocks.findIndex(stock => stock.symbol === symbol);
        if (existingStockIndex !== -1) {
            // Increment the quantity of existing stocks
            player.stocks[existingStockIndex].quantity += quantity;
        } else {
            // Add a new entry for the stock
            player.stocks.push({ symbol, quantity });
        }

        // Record the transaction in the player's trade history
        const trade = {
            symbol,
            quantity,
            price: pricePerShare,
            action: 'buy',
            date: new Date()
        };
        player.trades.push(trade);

        await player.save();
        res.send({ message: `Successfully bought ${quantity} shares of ${symbol}.`, player });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});


// Endpoint for selling stocks
router.post('/:id/sell', async (req, res) => {
    const playerId = req.params.id;
    const { symbol, quantity } = req.body;

    try {
        const player = await Player.findById(playerId);
        const stock = player.stocks.find(stock => stock.symbol === symbol);
        if (!stock || stock.quantity < quantity) {
            return res.status(400).send('Not enough stock to sell.');
        }

        const pricePerShare = await getStockPrice(symbol);
        const earnings = pricePerShare * quantity;

        player.cash += earnings;
        stock.quantity -= quantity;

        if (stock.quantity === 0) {
            player.stocks = player.stocks.filter(stock => stock.symbol !== symbol);
        }

        // Record the transaction in the player's trade history
        const trade = {
            symbol,
            quantity,
            price: pricePerShare,
            action: 'sell',
            date: new Date()
        };
        player.trades.push(trade);

        await player.save();
        res.send({ message: `Successfully sold ${quantity} shares of ${symbol}.`, player });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error.');
    }
});

router.get('/:id/trade-history', async (req, res) => {
    const playerId = req.params.id;
    try {
      const player = await Player.findById(playerId);
      if (!player) {
        return res.status(404).send('Player not found');
      }
      res.json(player.trades);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching trade history');
    }
  });
  

// Calculate and retrieve the total portfolio value of a player
router.get('/:id/portfolio/value', async (req, res) => {
    const playerId = req.params.id;

    try {
        const totalValue = await calculatePortfolioValue(playerId);
        res.send({ playerId, totalPortfolioValue: totalValue });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error calculating portfolio value');
    }
});
router.get('/leaderboard', async (req, res) => {
    try {
        // Fetch all players
        const players = await Player.find({});

        // Create an array to hold player values including their total portfolio value
        const playerValues = [];

        for (const player of players) {
            // Use the provided function to calculate each player's total portfolio value
            const totalValue = await calculatePortfolioValue(player._id);
            playerValues.push({
                id: player._id,
                name: player.name,
                totalPortfolioValue: totalValue,
            });
        }

        // Sort the array by total portfolio value in descending order
        console.log("Pre-sort player values:", playerValues.map(pv => `${pv.name}: ${pv.totalPortfolioValue}`));
        playerValues.sort((a, b) => b.totalPortfolioValue - a.totalPortfolioValue);
        console.log("Post-sort leaderboard:", playerValues);

        // Return the sorted list as the leaderboard
        res.json(playerValues);
    } catch (error) {
        console.error('Failed to generate leaderboard:', error);
        res.status(500).send('Error generating leaderboard');
    }
});

async function calculatePortfolioValue(playerId) {
    const player = await Player.findById(playerId);
    if (!player) {
        throw new Error('Player not found');
    }
    let totalValue = player.cash;

    for (const stock of player.stocks) {
        const pricePerShare = await getStockPrice(stock.symbol);
        totalValue += pricePerShare * stock.quantity;
    }

    return totalValue;
}

router.post('/daily', async (req, res) => {
    try {
      const newPlayer = new Player({
        name: req.body.name,
        // Include other player fields as necessary
        dailyChallenges: [{
          name: "Welcome Aboard",
          completed: true,
          dateCompleted: new Date()
        }]
      });
  
      await newPlayer.save();
  
      res.status(201).json(newPlayer);
    } catch (error) {
      console.error('Failed to create new player:', error);
      res.status(500).send(error.message);
    }
});

router.get('/market-trends', async (req, res) => {
  try {
    // Define the symbols you want to analyze, or accept them via query params
    const symbols = ['AAPL', 'MSFT', 'GOOGL'];
    const trends = await analyzeMarketTrends(symbols);
    res.json(trends);
  } catch (error) {
    res.status(500).send('Error fetching market trends');
  }
});

// Add a stock to the watchlist
router.post('/:id/watchlistadd', async (req, res) => {
    const { id } = req.params;
    const { symbol } = req.body;
    try {
        const player = await Player.findById(id);
        if (!player) return res.status(404).send('Player not found.');

        if (!player.watchlist.includes(symbol)) {
            player.watchlist.push(symbol);
            await player.save();
            res.status(200).send({ message: `${symbol} added to watchlist.` });
        } else {
            res.status(400).send({ message: `${symbol} is already in the watchlist.` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error when adding to watchlist.');
    }
});


// Remove a stock from the watchlist
router.post('/:id/watchlistremove', async (req, res) => {
    const { id } = req.params;
    const { symbol } = req.body;
    try {
        const player = await Player.findById(id);
        if (!player) return res.status(404).send('Player not found.');

        player.watchlist = player.watchlist.filter(s => s !== symbol);
        await player.save();
        res.status(200).send({ message: `${symbol} removed from watchlist.` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error when removing from watchlist.');
    }
});


// Get current prices for all stocks in the watchlist
router.get('/:id/prices', async (req, res) => {
    const { id } = req.params;
    try {
        const player = await Player.findById(id);
        if (!player) return res.status(404).send('Player not found.');

        const prices = await getCurrentPrices(player.watchlist);
        res.status(200).json(prices);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error when fetching watchlist prices.');
    }
});

  



module.exports = router;
