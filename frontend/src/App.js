// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Onboarding from './components/Onboarding';
import RoastBot from './components/RoastBot';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Onboarding />} />
        <Route path='/chat' element={<RoastBot />} />
      </Routes>
    </Router>
  );
}
