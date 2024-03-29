// testStockPrice.js
require('dotenv').config(); // Ensure environment variables are loaded
const { getStockPrice } = require('./stockUtils');


async function testGetStockPrice() {
    const symbol = 'AAPL'; // Use a well-known stock symbol for testing
    try {
        const price = await getStockPrice(symbol);
        console.log(`The current price of ${symbol} is $${price}`);
    } catch (error) {
        console.error('Error fetching stock price:', error);
    }
}

testGetStockPrice();
