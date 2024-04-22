const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Feedback = require('../models/Feedback');
const { getStockPrice, getCurrentPrices, fetchStockPerformance, analyzeMarketTrends, addToWatchlist, removeFromWatchlist, getWatchlistPrices } = require('../stockUtils');

// Assuming Express and a Player model are set up
router.post('/rename', async (req, res) => {
    const { currentName, newName } = req.body;
  
    try {
      const player = await Player.findOne({ name: currentName });
      if (!player) {
        return res.status(404).send('Player not found');
      }
  
      player.name = newName;
      await player.save();
  
      res.send({ message: 'Player name updated successfully', player });
    } catch (error) {
      console.error('Error updating player name:', error);
      res.status(500).send('Error updating player name');
    }
  });
  
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
  // Register a new player
// Register a new player with starting cash
router.post('/registers', async (req, res) => {
    const { name, startingCash } = req.body; // Destructure to get name and startingCash from the request body

    // Debug: Log the entire request body
    console.log(req.body);

    if (!name) {
      return res.status(400).send('Name is required');
    }

    try {
      // Create a new player with name and startingCash
      let player = new Player({ 
        name, 
        cash: startingCash ? Number(startingCash) : 0 // Use startingCash if provided, otherwise default to 0
      });

      player = await player.save(); // Save the new player to the database
      res.status(201).send(player); // Send the saved player as the response
    } catch (error) {
      res.status(400).send(error.message); // Send any errors that occur
    }
});
router.get('/players', async (req, res) => {
    try {
        console.log('.....................')
        const players = await Player.find({}); // Fetch all players from the database
        res.status(200).send(players); // Send the list of players as a response
    } catch (error) {
        res.status(500).send(error.message); // Send an error response if something goes wrong
    }
});
router.post('/:playerName/buys', async (req, res) => {
    const playerName = req.params.playerName;
    const { symbol, quantity } = req.body;
  
    if (quantity <= 0) {
      return res.status(400).send('Quantity must be greater than zero.');
    }
  
    try {
      const pricePerShare = 179.5; // Mocked stock price
      console.log(`Buying ${quantity} shares of ${symbol} at ${pricePerShare} each.`);
      const totalCost = pricePerShare * quantity;
  
      const player = await Player.findOne({ name: playerName });
      if (!player) {
        return res.status(404).send('Player not found.');
      }
  
      if (player.cash < totalCost) {
        return res.status(400).send('Insufficient funds.');
      }
  
      player.cash -= totalCost;
      const existingStockIndex = player.stocks.findIndex(stock => stock.symbol === symbol);
      if (existingStockIndex !== -1) {
        player.stocks[existingStockIndex].quantity += quantity;
      } else {
        player.stocks.push({ symbol, quantity });
      }
  
      // Log for debugging
      console.log(`Player ${playerName} now owns ${player.stocks.map(s => `${s.quantity} of ${s.symbol}`).join(", ")}.`);
  
      const trade = { symbol, quantity, price: pricePerShare, action: 'buy', date: new Date() };
      player.trades.push(trade);
      await player.save();
  
      res.send({ message: `Successfully bought ${quantity} shares of ${symbol}.`, player });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
});

  
  // Endpoint for selling stocks
  router.post('/:playerName/sells', async (req, res) => {
    const playerName = req.params.playerName;
    const { symbol, quantity } = req.body;
  
    if (quantity <= 0) {
      return res.status(400).send('Quantity must be greater than zero.');
    }
  
    try {
      const pricePerShare = 179.5; // Mocked stock price
      const totalSaleValue = pricePerShare * quantity;
  
      const player = await Player.findOne({ name: playerName });
      if (!player) {
        return res.status(404).send('Player not found.');
      }
  
      const stockIndex = player.stocks.findIndex(stock => stock.symbol === symbol);
      if (stockIndex === -1 || player.stocks[stockIndex].quantity < quantity) {
        return res.status(400).send('Not enough stock to sell.');
      }
  
      player.stocks[stockIndex].quantity -= quantity;
      if (player.stocks[stockIndex].quantity === 0) {
        player.stocks.splice(stockIndex, 1);
      }
  
      player.cash += totalSaleValue;
      const trade = { symbol, quantity, price: pricePerShare, action: 'sell', date: new Date() };
      player.trades.push(trade);
      await player.save();
  
      res.send({ message: `Successfully sold ${quantity} shares of ${symbol}.`, player });
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error.');
    }
  });
  router.post('/submit', async (req, res) => {
    try {
      const { content } = req.body;
      const newFeedback = new Feedback({ content });
      await newFeedback.save();
      res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      res.status(500).json({ success: false, message: 'Failed to submit feedback' });
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
router.get('/value', async (req, res) => {
    const playerId = req.params.id;

    try {
        const totalValue = await calculateMockPortfolioValue(playerId);
        res.send({ playerId, totalPortfolioValue: totalValue });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error calculating portfolio value');
    }
});
router.get('/leaderboard', async (req, res) => {
    try {
        const players = await Player.find({});
        console.log(`Found ${players.length} players in the database.`); // Log the number of players found

        const promises = players.map(async (player) => {
            const totalValue = await calculateMockPortfolioValue(player._id);
            console.log(`Player ${player.name} (ID: ${player._id}) has a total portfolio value of ${totalValue}.`); // Log each player's total value
            return {
                id: player._id,
                name: player.name,
                totalPortfolioValue: totalValue,
            };
        });

        const playerValues = await Promise.all(promises);


        playerValues.sort((a, b) => b.totalPortfolioValue - a.totalPortfolioValue);

       

        res.json(playerValues);
    } catch (error) {
        console.error('Failed to generate leaderboard:', error);
        res.status(500).send('Error generating leaderboard');
    }
});
router.get('/top-player', async (req, res) => {
    try {
        const players = await Player.find({});
        if (players.length === 0) {
            return res.status(404).send('No players found');
        }

        const promises = players.map(async (player) => {
            const totalValue = await calculateMockPortfolioValue(player._id);
            return {
                id: player._id,
                name: player.name,
                totalPortfolioValue: totalValue,
            };
        });

        const playerValues = await Promise.all(promises);
        playerValues.sort((a, b) => b.totalPortfolioValue - a.totalPortfolioValue);

        const topPlayer = playerValues[0]; // Get the top player
        res.json({ topPlayerName: topPlayer.name }); // Return the top player's name
    } catch (error) {
        console.error('Failed to find top player:', error);
        res.status(500).send('Error finding top player');
    }
});


async function calculateMockPortfolioValue(playerId) {
    try {
        const player = await Player.findById(playerId);
        if (!player) {
            throw new Error(`Player not found for ID: ${playerId}`);
        }
        let totalValue = player.cash;
        console.log(`Starting calculation for ${player.name} with initial cash ${player.cash}.`); // Log initial cash

        const mockedPricePerShare = 179.5;
        for (const stock of player.stocks) {
            totalValue += mockedPricePerShare * stock.quantity;
            console.log(`Adding stock value. Symbol: ${stock.symbol}, Quantity: ${stock.quantity}, TotalValue now: ${totalValue}.`); // Log addition of stock value
        }

        console.log(`Final total portfolio value for ${player.name} is ${totalValue}.`); // Log final total value
        return totalValue;
    } catch (error) {
        console.error(`Error calculating portfolio value for player ID: ${playerId}`, error);
        throw error; // Ensure the error is re-thrown so it can be caught in the router
    }
}


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
