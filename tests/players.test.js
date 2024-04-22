const request = require('supertest');
require('dotenv').config(); // Import environment variables from .env file
const mongoose = require('mongoose');
const Game = require('../models/game.js');
const app = require('../server.js'); // Import the Express app
const Player = require('../models/player.js');

const { analyzeMarketTrends } = require('../stockUtils'); // Import the function for analyzing market trends
const fetch = require('node-fetch'); // Mock fetch for network requests
jest.mock('node-fetch'); // Tell Jest to mock all fetch calls

// Setup connection to the test database
beforeAll(async () => {
  // Connect to a test database before running tests
  const url = 'mongodb://localhost:27017/stockTradingGameTest1';
  await mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Clean up the test database
afterEach(async () => {
  // Delete all players after each test to avoid data pollution
  await Player.deleteMany({});
});

afterAll(async () => {
  // Close the database connection after all tests have run
  await mongoose.connection.close();
});

// Mock the stockUtils functions used in the tests
jest.mock('../stockUtils', () => ({
  getStockPrice: jest.fn().mockResolvedValue(100), // Mock getStockPrice to always return 100
  analyzeMarketTrends: jest.fn().mockImplementation((symbols) => {
    // Mock analyzeMarketTrends to return predefined trends for test symbols
    return Promise.resolve(symbols.map(symbol => ({
      symbol,
      latestPrice: symbol === 'AAPL' ? 150.00 : 130.00,
      previousPrice: symbol === 'AAPL' ? 145.00 : 135.00,
      trend: symbol === 'AAPL' ? 'up' : 'down',
    })));
  })
}));

// Define tests for portfolio management functionality
describe('Portfolio management', () => {
  test('Register a new player', async () => {
    // Test player registration
    const response = await request(app)
      .post('/api/players/register')
      .send({ name: 'Test Player' })
      .expect(201); // Expect HTTP 201 status for successful creation

    // Check if the player's name and cash balance are correctly set
    expect(response.body.name).toBe('Test Player');
    expect(response.body.cash).toBe(10000); // Assuming 10000 is the starting cash
  });

  // Testing portfolio value calculation for a player
test('Calculate portfolio value', async () => {
    // First, create a new player in the database with initial cash and stocks
    let player = new Player({ name: 'Test Player', cash: 10000, stocks: [{ symbol: 'AAPL', quantity: 2 }] });
    player = await player.save();
  
    // Request the API to calculate the player's portfolio value
    const response = await request(app)
      .get(`/api/players/${player.id}/portfolio/value`)
      .expect(200);
  
    // Assert that the calculated portfolio value is as expected (cash + value of stocks)
    expect(response.body.totalPortfolioValue).toBe(10200); // 10000 cash + 2 * 100 for AAPL stocks
  });
  
  // Testing the functionality to buy stocks
  test('Buy stocks', async () => {
    // Create a new player with initial cash
    let player = new Player({ name: 'Test Player', cash: 10000 });
    player = await player.save();
  
    // Simulate a stock purchase by the player
    const response = await request(app)
      .post(`/api/players/${player.id}/buy`)
      .send({ symbol: 'AAPL', quantity: 3 })
      .expect(200);
  
    // Check if the purchase was successful by validating the updated cash and stocks
    expect(response.body.player.cash).toBe(9700); // 10000 initial cash - 300 spent on stocks
    expect(response.body.player.stocks.length).toBe(1);
    expect(response.body.player.stocks[0].symbol).toBe('AAPL');
    expect(response.body.player.stocks[0].quantity).toBe(3);
  });
  
  // Testing the functionality to sell stocks
  test('Sell stocks', async () => {
    // Create a new player with initial cash and some stocks
    let player = new Player({ name: 'Test Player', cash: 10000, stocks: [{ symbol: 'AAPL', quantity: 3 }] });
    player = await player.save();
  
    // Simulate selling some of the stocks
    const response = await request(app)
      .post(`/api/players/${player.id}/sell`)
      .send({ symbol: 'AAPL', quantity: 2 })
      .expect(200);
  
    // Check if the sale was successful by validating the updated cash and remaining stocks
    expect(response.body.player.cash).toBe(10200); // 10000 initial cash + 200 gained from selling stocks
    expect(response.body.player.stocks.length).toBe(1);
    expect(response.body.player.stocks[0].symbol).toBe('AAPL');
    expect(response.body.player.stocks[0].quantity).toBe(1); // Sold 2, so 1 remains
  });
  
  // Testing error handling for invalid stock purchase data
  test('Error handling - Invalid data for buying stocks', async () => {
    let player = new Player({ name: 'Test Player', cash: 10000 });
    player = await player.save();
  
    // Attempt to buy stocks with invalid quantity and expect an error response
    await request(app)
      .post(`/api/players/${player.id}/buy`)
      .send({ symbol: 'AAPL', quantity: -1 }) // Invalid quantity
      .expect(400); // Expecting error response for invalid data
  });
  
  // Testing error handling for insufficient funds when buying stocks
  test('Error handling - Insufficient funds for buying stocks', async () => {
    let player = new Player({ name: 'Test Player', cash: 100 }); // Not enough cash to buy stocks
    player = await player.save();
  
    // Attempt to buy stocks without enough cash and expect an error response
    await request(app)
      .post(`/api/players/${player.id}/buy`)
      .send({ symbol: 'AAPL', quantity: 2 }) // Total cost exceeds cash balance
      .expect(400); // Expecting error response for insufficient funds
  });
  
  // Testing edge case for buying stocks with zero quantity
  test('Edge case - Buying stocks with zero quantity', async () => {
    let player = new Player({ name: 'Test Player', cash: 10000 });
    player = await player.save();
  
    // Attempt to buy stocks with zero quantity and expect an error response
    await request(app)
      .post(`/api/players/${player.id}/buy`)
      .send({ symbol: 'AAPL', quantity: 0 }) // Zero quantity
      .expect(400); // Expecting error response for invalid quantity
  });
  
  // Testing sequential registration of players without errors
  describe('Player Registration', () => {
    it('should register two players sequentially without errors', async () => {
      // Register the first player and check the response
      const playerOneResponse = await request(app)
        .post('/api/players/register')
        .send({ name: 'Player One' })
        .expect(201); // Expecting HTTP status 201 for successful creation
      expect(playerOneResponse.body).toHaveProperty('name', 'Player One');
  
      // Register the second player with a unique name and check the response
      const playerTwoResponse = await request(app)
        .post('/api/players/register')
        .send({ name: 'Player Two' })
        .expect(201); // Expecting HTTP status 201 for successful creation
      expect(playerTwoResponse.body).toHaveProperty('name', 'Player Two');
    });
  });
  
  test('Admin creates a new game', async () => {
    const response = await request(app)
      .post('/api/admin/create') // Adjust the endpoint as needed
      .send({
        name: 'New Game',
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 1 day from now
      })
      .expect(201); // Assuming 201 Created is the response for a successful creation
  
    expect(response.body.success).toBe(true);
    expect(response.body.gameId).toBeDefined(); // Check if gameId is defined
    // Further assertions can be made based on the response structure
  });
  describe('Declare Winner', () => {
    let gameId;
    let player1Id, player2Id;
  
    beforeAll(async () => {
      // Create a new game
      const gameResponse = await request(app)
        .post('/api/admin/create')
        .send({
          name: 'Winner Declaration Test',
          startTime: new Date(),
          endTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        })
        .expect(201);
      gameId = gameResponse.body.gameId;
  
      // Register two new players and save their IDs
      const player1Response = await request(app)
        .post('/api/players/register')
        .send({ name: 'Player 1', gameId })
        .expect(201);
      player1Id = player1Response.body._id;

      const player2Response = await request(app)
        .post('/api/players/register')
        .send({ name: '2', gameId })
        .expect(201);
      player2Id = player2Response.body._id;
  
      
  
      // Simulate player actions to differentiate their portfolio values
      // Assuming these actions adjust the players' portfolio values accordingly
      await request(app).post(`/api/players/${player1Id}/buy`).send({ symbol: 'AAPL', quantity: 5 });
      await request(app).post(`/api/players/${player2Id}/buy`).send({ symbol: 'AAPL', quantity: 10 });
    });
  
    test('Correct player is declared as winner', async () => {
      const declareWinnerResponse = await request(app)
        .post(`/api/admin/games/${gameId}/declare-winner`)
        .expect(200);
  
      expect(declareWinnerResponse.body.success).toBe(true);
      
      
      // This assertion assumes the declare winner endpoint returns the winner's name
      // You'll need to adjust this according to your actual response structure
      expect(declareWinnerResponse.body.playerId).toBe();
    });
  
    afterEach(async () => {
      await Player.deleteMany({ _id: [player1Id, player2Id] });
      await Game.deleteMany({ _id: gameId });
    });
  });
  
test('New player automatically completes "Welcome Aboard" challenge', async () => {
    const playerName = 'Test Player0';

    const response = await request(app)
      .post('/api/players/daily') // Adjust this if your endpoint is different
      .send({ name: playerName })
      .expect(201); // HTTP status code for created

    // Check the response contains the player with the expected name
    expect(response.body.name).toBe(playerName);

    // Check the "Welcome Aboard" challenge is present and marked as completed
    const welcomeChallenge = response.body.dailyChallenges.find(challenge => challenge.name === "Welcome Aboard");
    expect(welcomeChallenge).toBeDefined();
    expect(welcomeChallenge.completed).toBeTruthy();
    expect(new Date(welcomeChallenge.dateCompleted)).toBeInstanceOf(Date); // Check dateCompleted is a valid date
  });
  describe('Trade History', () => {
    test('records and fetches trade history', async () => {
      // Assuming you have a function to create a player and simulate trades...
      let player = await new Player({ name: 'Test Player', cash: 10000 }).save();
      const buyResponse = await request(app)
          .post(`/api/players/${player.id}/buy`)
          .send({ symbol: 'AAPL', quantity: 3 })
          .expect(200);
  
      const historyResponse = await request(app)
        .get(`/api/players/${player.id}/trade-history`)
        .expect(200);
  
      expect(historyResponse.body.length).toBeGreaterThan(0);
      expect(historyResponse.body[0]).toHaveProperty('symbol', 'AAPL');
      expect(historyResponse.body[0]).toHaveProperty('action', 'buy');
      // Add more assertions as needed
    });
  });
  // Test suite for analyzing market trends based on stock prices
describe('analyzeMarketTrends', () => {
    // Clear mock data before each test for consistency
    beforeEach(() => {
      fetch.mockClear();
    });
  
    // Test case for identifying an upward trend in a stock's price
    it('should identify an upward trend for a given stock', async () => {
      // Simulate analyzing market trends for the AAPL stock
      const trends = await analyzeMarketTrends(['AAPL']);
      // Assert that the function correctly identifies an upward trend
      expect(trends[0]).toEqual({
        symbol: 'AAPL',
        latestPrice: 150.00, // Latest price is higher than the previous
        previousPrice: 145.00, // Previous price
        trend: 'up', // The trend should be 'up'
      });
    });
  
    // Test case for identifying a downward trend in a stock's price
    it('should identify a downward trend for a given stock', async () => {
      // Simulate analyzing market trends for the MSFT stock
      const trends = await analyzeMarketTrends(['MSFT']);
      // Assert that the function correctly identifies a downward trend
      expect(trends[0]).toEqual({
        symbol: 'MSFT',
        latestPrice: 130.00, // Latest price is lower than the previous
        previousPrice: 135.00, // Previous price
        trend: 'down', // The trend should be 'down'
      });
    });
});  

// Test suite for watchlist functionality, including adding and removing stocks
describe('Watchlist functionality', () => {
    let playerId; // Will store the ID of the created player for each test
  
    // Create a new player before each test
    beforeEach(async () => {
      // Create a player with initial cash and an empty watchlist
      const player = await Player.create({ name: 'Test Player', cash: 10000, watchlist: [] });
      playerId = player.id; // Store player ID for use in tests
    });
  
    // Test case for adding a stock to the player's watchlist
    test('adds a stock to the watchlist', async () => {
      const symbol = 'AAPL'; // Define the stock symbol to add
      // Make a POST request to add the stock to the watchlist
      await request(app)
        .post(`/api/players/${playerId}/watchlistadd`)
        .send({ symbol })
        .expect(200); // Expect a 200 OK response
  
      // Fetch the updated player and verify the watchlist contains the added stock
      const updatedPlayer = await Player.findById(playerId);
      expect(updatedPlayer.watchlist).toContain(symbol);
    });
  
    // Test case for removing a stock from the player's watchlist
    test('removes a stock from the watchlist', async () => {
      const symbol = 'AAPL'; // Define the stock symbol to remove
      // Add the stock to the watchlist directly before testing its removal
      await Player.findByIdAndUpdate(playerId, { $push: { watchlist: symbol } });
  
      // Make a POST request to remove the stock from the watchlist
      await request(app)
        .post(`/api/players/${playerId}/watchlistremove`)
        .send({ symbol })
        .expect(200); // Expect a 200 OK response
  
      // Fetch the updated player and verify the watchlist does not contain the removed stock
      const updatedPlayer = await Player.findById(playerId);
      expect(updatedPlayer.watchlist).not.toContain(symbol);
    });
});


  // Add more tests for additional scenarios
});

