import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { DrawingCanvas } from "./components/DrawingCanvas";
import { DrawingGallery } from "./components/DrawingGallery";
import { Navigation } from "./components/Navigation";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DrawingCanvas />} />
            <Route path="/gallery" element={<DrawingGallery />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
