import React from 'react';
import '../App.css';

const Loader: React.FC = () => {
  return (
    <div className="loader-container">
      <span className="loader"></span>
      <p>Загрузка...</p>
    </div>
  );
};

export default Loader;
