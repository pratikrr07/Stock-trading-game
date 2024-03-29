// db.js

const mongoose = require('mongoose');

async function connectDB() {
    const defaultDbUri = 'mongodb://localhost:27017/stockTradingGame1';
    const testDbUri = 'mongodb://localhost:27017/stockTradingGameTest1';
    const dbUri = process.env.NODE_ENV === 'test' ? testDbUri : defaultDbUri;

    try {
        await mongoose.connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Connected to MongoDB at ${dbUri}...`);
    } catch (error) {
        console.error('Could not connect to MongoDB...', error);
    }
}

module.exports = connectDB;

