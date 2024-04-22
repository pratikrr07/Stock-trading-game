import React, { useState } from 'react';

const BuyComponent = ({ onBuy, players }) => {
  const [quantity, setQuantity] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');
  // Mock the stock price as a static value
  const stockPrice = 179.5;

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Selected Player ID:', selectedPlayer);
    // Pass the mocked stock price along with other parameters to onBuy
    // Assuming onBuy function can accept stockPrice even if it's not used in the backend call
    onBuy(selectedPlayer, stockSymbol, quantity, stockPrice);
    setQuantity('');
    setStockSymbol('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Buy Stocks</h3>
      <select
        value={selectedPlayer}
        onChange={(e) => setSelectedPlayer(e.target.value)}
        required
      >
        <option value="">Select Player</option>
        {players.map((player) => (
          <option key={player.id} value={player.id}>
            {player.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={stockSymbol}
        onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
        placeholder="Stock Symbol"
        required
      />
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        placeholder="Quantity"
        min="1"
        required
      />
      {/* Display the mocked stock price */}
      <p>Current Price: AAPL: ${stockPrice}</p>
      <p>Current Price: AMZN: $ 183.34</p>
      <p>Current Price: TSLA: $ 169.99</p>
      
      <button type="submit">Buy</button>
    </form>
  );
};

export default BuyComponent;


