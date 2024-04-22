// index.js
require('dotenv').config();
const app = require('./server.js'); // Import the Express app

const connectDB = require('./db'); // Import the connectDB function

const PORT = process.env.PORT || 3001;

// Connect to the database before starting the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});