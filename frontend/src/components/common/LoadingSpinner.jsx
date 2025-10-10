import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Chargement...' }) => {
  const sizes = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  return (
    <div className="loading-container">
      <div className={`spinner ${sizes[size]}`}></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;