import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirecting after successful registration

const Register = () => {
  const [name, setName] = useState('');
  const [startingCash, setStartingCash] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear any existing errors
    setSuccessMessage(''); // Clear any existing success messages

    // Include startingCash in the registration payload
    axios.post('http://localhost:3001/api/players/registers', { name, startingCash: Number(startingCash) })
      .then(response => {
        console.log("Registration successful:", response.data);
        setName('');
        setStartingCash(''); // Reset starting cash
        setIsLoading(false);
        setSuccessMessage(`Registration successful for ${name} with starting cash of ${startingCash}. You can add another player or finalize registration.`);
        // Don't navigate immediately after registration
      })
      .catch(error => {
        console.error("Registration failed:", error);
        setError('Registration failed. Please try again.');
        setIsLoading(false);
      });
  };

  // Function to handle finalization and navigation
  const finalizeRegistration = () => {
    navigate('/dashboard'); // Navigate to the main page or dashboard
  };

  return (
    <div>
      <h2>Register Player</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleRegister}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Starting Cash:
          <input
            type="number"
            value={startingCash}
            onChange={(e) => setStartingCash(e.target.value)}
            required
            min="0" // Assuming starting cash cannot be negative
          />
        </label>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <button type="button" onClick={finalizeRegistration} disabled={isLoading || !successMessage}>
          Finalize Registration
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};

export default Register;
