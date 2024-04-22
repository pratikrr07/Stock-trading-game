// src/components/Portfolio.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Portfolio = ({ playerId }) => {
  // Include playerId in the parent component
  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:3001/api/players/${playerId}/portfolio/value`)
      .then(response => {
        setPortfolio(response.data);
      })
      .catch(error => {
        console.error("Failed to fetch portfolio value:", error);
        setError('Failed to fetch portfolio value');
      });
  }, [playerId]);

  return (
    <div>
      <h1>Portfolio</h1>
      {/* Render portfolio details here */}
      {error && <p>{error}</p>}
    </div>
  );
};

export default Portfolio;
