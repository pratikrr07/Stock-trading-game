const express = require('express');
const Game = require('../models/game'); // Adjust the path as necessary
const router = express.Router();
const { declareWinner } = require('../services/gameService');
// Endpoint to create a new game
router.post('/create', async (req, res) => {
    try {
        const { name, startTime, endTime } = req.body;
        const newGame = new Game({
            name,
            startTime,
            endTime,
            status: 'pending' // Initial status is 'pending' until the game starts
        });

        await newGame.save();
        res.status(201).json({ success: true, message: 'Game created successfully', gameId: newGame._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to create game', error: error.message });
    }
});
router.get('/games', async (req, res) => {
    try {
        const games = await Game.find(); // Adjust this query as needed, e.g., to find only active games
        res.json(games);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching games');
    }
});

router.post('/games/:gameId/declare-winner', async (req, res) => {
    try {
        const winner = await declareWinner(req.params.gameId);
        res.status(200).json({ success: true, message: "Winner declared successfully.", winner });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error declaring winner.", error: error.toString() });
    }
});
router.post('/declare-winner', async (req, res) => {
    try {
        const winner = await declareWinner(req.params.gameId);
        res.status(200).json({ success: true, message: "Winner declared successfully.", winner });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error declaring winner.", error: error.toString() });
    }
});
module.exports = router;
