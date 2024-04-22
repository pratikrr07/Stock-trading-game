// src/components/Trade.js
import React, { useState } from 'react';
import axios from 'axios';

const Trade = ({ playerId }) => {
  // Include playerId in the parent component
  const [tradeDetails, setTradeDetails] = useState({ symbol: '', quantity: 0 });
  const [error, setError] = useState('');

  const handleTrade = (action) => {
    axios.post(`http://localhost:3001/api/players/${playerId}/${action}`, tradeDetails)
      .then(response => {
        console.log(`${action} successful:`, response.data);
        // Update UI accordingly
      })
      .catch(error => {
        console.error(`${action} failed:`, error);
        setError(`${action} failed`);
      });
  };

  return (
    <div>
      <input
        type="text"
        name="symbol"
        value={tradeDetails.symbol}
        onChange={(e) => setTradeDetails({ ...tradeDetails, symbol: e.target.value })}
        placeholder="Stock Symbol"
      />
      <input
        type="number"
        name="quantity"
        value={tradeDetails.quantity}
        onChange={(e) => setTradeDetails({ ...tradeDetails, quantity: Number(e.target.value) })}
        placeholder="Quantity"
      />
      <button onClick={() => handleTrade('buy')}>Buy</button>
      <button onClick={() => handleTrade('sell')}>Sell</button>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Trade;

