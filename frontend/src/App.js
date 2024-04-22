import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AdminPage from './components/AdminPage'; 
import DeclareWinner from './components/DeclareWinner';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add this line */}
        <Route path="/admin" element={<AdminPage />} /> {/* Corrected line */}
        <Route path="/declare-winner" element={<DeclareWinner />} />
        {/* Add other routes here */}
      </Routes>
    </Router>
  );
}

export default App;



