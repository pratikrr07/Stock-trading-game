import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Leaderboard = () => {
  const [players, setPlayers] = useState([]);

  const fetchLeaderBoard = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/players/leaderboard');
      setPlayers(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  useEffect(() => {
    fetchLeaderBoard();
  }, []);

  return (
    <div>
      <h2>Leaderboard</h2>
      <ul>
        {players.map((player, index) => (
          <li key={player.id}>
            {index + 1}. {player.name} - {player.totalPortfolioValue} points
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Leaderboard;




