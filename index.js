// index.js

const { app } = require('./server'); // Import the app from server.js
const connectDB = require('./db'); // Import the connectDB function

const PORT = process.env.PORT || 3000;

// Connect to the database before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});