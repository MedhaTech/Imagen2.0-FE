/* eslint-disable indent */
import React, { useState } from 'react';
// import '../StateWise/style.css'; // Import the CSS file

const ToggleSwitch = ({ isEnabled, onToggle }) => {
  const [enabled, setEnabled] = useState(isEnabled);

  const handleToggle = () => {
    const newStatus = !enabled ? "1" : "0";
    setEnabled(!enabled);
    onToggle(newStatus);
  };

  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={enabled}
        onChange={handleToggle}
      />
      <span className="slider"></span>
    </label>
  );
};

export default ToggleSwitch;
