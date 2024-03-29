const mongoose = require('mongoose');

// Define the schema for a player's stock holding
const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0 // Ensure the quantity is non-negative
  }
});

// Define a schema for daily challenges
const dailyChallengeSchema = new mongoose.Schema({
  name: String,
  completed: { type: Boolean, default: false },
  dateCompleted: { type: Date, default: null }
});
const tradeSchema = new mongoose.Schema({
    symbol: String,
    quantity: Number,
    price: Number,
    action: { type: String, enum: ['buy', 'sell'] },
    date: { type: Date, default: Date.now }
  });

  



// Define the schema for a player
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cash: {
    type: Number,
    default: 10000, // Default starting cash for each player
    min: 0 // Ensure cash is non-negative
  },
  stocks: [stockSchema], // Array of stock holdings
  dailyChallenges: [dailyChallengeSchema], // Daily challenges
  trades: [tradeSchema],
  watchlist: [{
    type: String, // Stock symbol
  }] 
  
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;


