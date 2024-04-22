const express = require('express');
const cors = require('cors'); // Require CORS
const app = express();


app.use(cors()); // Use CORS before other routes or middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow only the React frontend to access the backend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify which HTTP methods are allowed
    credentials: true, // Allow cookies to be sent across origins
}));

// Routes
const playersRoute = require('./routes/players');
const adminRoutes = require('./routes/admin');
// const leaderBoardRoutes = require('./routes/leaderboard')
app.use('/api/players', playersRoute);
app.use('/api/admin', adminRoutes);
// app.use('/api/leaderboard', leaderBoardRoutes)

module.exports = app;

