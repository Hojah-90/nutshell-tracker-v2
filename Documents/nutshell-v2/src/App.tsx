import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TrackerProvider } from "./context/TrackerContext";
import Tracker from "./features/tracker/Tracker";
import Calendar from "./features/calendar/Calendar";
import Header from "./components/Header";
import { FONTS, APP as AppConfig } from "./config";

const App = () => {
  return (
    <TrackerProvider>
      <Router basename="/nutshell-tracker-v2">
        <div className="fade-container">
          <Header/>
          <div className="container mx-auto p-2 sm:p-4 bg-cream relative font-quicksand overflow-y-auto h-screen">
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 font-sacramento text-lavender-dark mx-auto w-fit">
              {AppConfig.TITLE}
            </h1>
            <Routes>
              <Route path="/" element={<Tracker />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={<Tracker />} />
            </Routes>
          </div>
        </div>
      </Router>
    </TrackerProvider>
  );
};

export default App;