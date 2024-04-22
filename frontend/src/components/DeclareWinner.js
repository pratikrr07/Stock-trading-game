import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const DeclareWinner = () => {
    const { gameId } = useParams();
    const [winnerName, setWinnerName] = useState('');
    const [error, setError] = useState('');

    const declareWinner = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/players/leaderboard`);
            if (response.data && response.data.length > 0) {
                // Assuming the list is already sorted, pick the first player as the top player
                setWinnerName(response.data[0].name);
            }
            console.log('Winner declared successfully');
           
        } catch (error) {
            console.error('Error declaring winner:', error);
            setError('Failed to declare winner. Please try again.');
        }
    };

    return (
        <div>
            <h1>Declare Winner for Game ID: {gameId}</h1>
            <button onClick={declareWinner}>Declare Winner</button>
            {winnerName && <h3>Winner: {winnerName}</h3>}
            {error && <p>{error}</p>}
        </div>
    );
};

export default DeclareWinner;
