import React, { useState } from 'react';

const SellComponent = ({ onSell, players }) => {
  const [quantity, setQuantity] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [stockSymbol, setStockSymbol] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Selected Player ID:', selectedPlayer);
    // Trigger the onSell function passed as prop, with the selected player's ID, stock symbol, and quantity
    onSell(selectedPlayer, stockSymbol, quantity);
    // Reset the form fields after submission
    setQuantity('');
    setStockSymbol('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sell Stocks</h3>
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
      <button type="submit">Sell</button>
    </form>
  );
};

export default SellComponent;

