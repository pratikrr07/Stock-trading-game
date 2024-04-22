import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BuyComponent from './BuyComponent';
import SellComponent from './SellComponent';
import Leaderboard from './Leaderboard';

const Dashboard = () => {
    const [players, setPlayers] = useState([]);
    const navigate = useNavigate();

    const fetchPlayers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/players/players');
            setPlayers(response.data);
        } catch (error) {
            console.error('Failed to fetch players:', error);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, []);

    const handleBuy = async (playerName, symbol, quantity) => {
        try {
            const url = `http://localhost:3001/api/players/${encodeURIComponent(playerName)}/buys`;
            const response = await axios.post(url, {
                symbol,
                quantity
            });
            console.log(response.data.message);
            fetchPlayers(); // Refresh player data after a buy operation
        } catch (error) {
            console.error('Error buying stock:', error.response ? error.response.data : error.message);
        }
    };

    const handleSell = async (playerName, symbol, quantity) => {
        try {
            const url = `http://localhost:3001/api/players/${encodeURIComponent(playerName)}/sells`;
            const response = await axios.post(url, {
                symbol,
                quantity
            });
            console.log(response.data.message);
            fetchPlayers(); // Refresh player data after a sell operation
        } catch (error) {
            console.error('Error selling stock:', error.response ? error.response.data : error);
        }
    };

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <div className="player-balances">
                <h2>Player Balances</h2>
                <ul>
                    {players.map((player) => (
                        <li key={player.id}>
                            {player.name}: Cash - ${player.cash.toFixed(2)}
                        </li>
                    ))}
                </ul>
            </div>
            <Leaderboard />
            <BuyComponent onBuy={handleBuy} players={players} />
            <SellComponent onSell={handleSell} players={players} />
            <button onClick={() => navigate('/admin')}>Go to Admin Page</button>
        </div>
    );
};

export default Dashboard;
