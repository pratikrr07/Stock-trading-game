const Game = require('../models/game');
const calculatePortfolioValue = require('../utils/portfolioValue');

async function declareWinner(gameId) {
    const game = await Game.findById(gameId).populate('players');
    let highestValue = 0;
    let winner = null;

    for (let player of game.players) {
        const value = await calculatePortfolioValue(player);
        if (value > highestValue) {
            highestValue = value;
            winner = player;
        }
    }

    // Optionally update the game to mark it as completed
    game.status = 'completed';
    await game.save();

    return winner;
}
module.exports = {
    declareWinner
};