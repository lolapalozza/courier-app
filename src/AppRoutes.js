
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.js';
import Add from './Add.js';
import {Drop} from "./Drop.jsx";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add" element={<Add />} />
        <Route path="/drop/:id" element={<Drop />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
