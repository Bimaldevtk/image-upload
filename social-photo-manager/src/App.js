import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './components/Upload';
import Gallery from './components/Gallery';

function App() {
  return (
    <Router>
      <div>
        <h1>Social Photo Manager</h1>
        <Routes>
          <Route path="/" element={<Upload />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
