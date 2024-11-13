import React from 'react';

function NodeDetails({ connections, isValid, onClose }) {
  return (
    <div className={`node-details ${isValid ? 'valid' : 'invalid'} open`}>
      <div className="node-details-header">
        <h2>Connection Details</h2>
        <button onClick={onClose} className="close-btn">X</button>
      </div>
      <ul>
        {connections.map((conn, index) => (
          <li key={index}>{`${conn.source} -> ${conn.target}`}</li>
        ))}
      </ul>
      <p>Status: {isValid ? 'Circuit is valid!' : 'Circuit is invalid!'}</p>
    </div>
  );
}

export default NodeDetails;
