import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Auth/Login';
import Register from './Auth/Register';
import JobApplication from './dashboard/JobApplication';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/Main" element={<JobApplication/>}/>
      </Routes>
    </Router>
  );
};

export default App;
