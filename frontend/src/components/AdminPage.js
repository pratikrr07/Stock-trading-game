import React, { useState } from 'react';
import axios from 'axios';
import './AdminPage.css'; 

import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  // State for renaming a player
  const navigate = useNavigate();
  const [currentName, setCurrentName] = useState('');
  const [newName, setNewName] = useState('');

  // State for creating a game
  const [gameName, setGameName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  // Feedback states
  const [renameFeedback, setRenameFeedback] = useState('');
  const [createGameFeedback, setCreateGameFeedback] = useState('');

  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  // Handle renaming a player
  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/players/rename', { currentName, newName });
      console.log(response.data.message);
      setRenameFeedback('Player name updated successfully.');
      setCurrentName('');
      setNewName('');
    } catch (error) {
      console.error('Error updating player name:', error);
      setRenameFeedback('Failed to update player name.');
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/players/submit', { content });
      setContent('');
      setMessage(response.data.message);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setMessage('Failed to submit feedback. Please try again later.');
    }
  };

  // Handle creating a game
  const handleCreateGameSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/admin/create', {
        name: gameName,
        startTime,
        endTime,
      });
      
      console.log(response.data.message);
      setCreateGameFeedback('Game created successfully.');
      setGameName('');
      setStartTime('');
      setEndTime('');
  
      // Navigate to the declare winner page for the newly created game
      // Assume response.data.gameId contains the ID of the newly created game
     
    } catch (error) {
      console.error('Error creating game:', error);
      setCreateGameFeedback('Failed to create game.');
    }
  };

  return (
    <div className="admin-panel">
    <h2>Admin Panel</h2>
    
    {/* Form for Renaming a Player */}
    <div className="form-section">
      <h3>Rename Player</h3>
      {renameFeedback && <div className="feedback">{renameFeedback}</div>}
      <form onSubmit={handleRenameSubmit}>
        <label>
          Current Name:
          <input type="text" value={currentName} onChange={(e) => setCurrentName(e.target.value)} required />
        </label>
        <label>
          New Name:
          <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} required />
        </label>
        <button type="submit">Update Name</button>
      </form>
    </div>
    
    {/* Form for Creating a Game */}
    <div className="form-section">
      <h3>Create Game</h3>
      {createGameFeedback && <div className="feedback">{createGameFeedback}</div>}
      <form onSubmit={handleCreateGameSubmit}>
        <label>
          Game Name:
          <input type="text" value={gameName} onChange={(e) => setGameName(e.target.value)} required />
        </label>
        <label>
          Start Time:
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
        </label>
        <label>
          End Time:
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
        </label>
        <button onClick={() => navigate('/declare-winner')}>Create game</button>
      </form>
    </div>
    <div>
      <h2>Leave Feedback</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          placeholder="Your feedback..."
          rows="4"
        ></textarea>
        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  </div>
  
);
};

export default AdminPage;
