import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import PageView from './components/PageView';
import NotFound from "./components/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/:path" element={<PageView />} />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
