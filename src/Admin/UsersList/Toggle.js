/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState } from 'react';
import './style.css'; 

const ToggleSwitch = ({ isEnabled, onToggle }) => {

  const handleToggle = () => {
    const newStatus = !isEnabled ? 1 : 0;
    onToggle(newStatus);
  };

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={isEnabled}
        onChange={handleToggle}
      />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;
