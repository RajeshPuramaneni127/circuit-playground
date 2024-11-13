import React, { useState } from 'react';

function ControlPanel({ onAddNode, onDeleteNode, onValidate, isDeleteButtonActive }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedNode, setSelectedNode] = useState('');

  const handleAddClick = () => {
    setShowDropdown(true);
  };

  const handleSelectNode = (event) => {
    setSelectedNode(event.target.value);
  };

  const handleAddSelectedNode = () => {
    if (selectedNode) {
      onAddNode(selectedNode);
    }
    setShowDropdown(false);
  };

  return (
    <div className="control-panel">
      <button onClick={handleAddClick}>Add</button>
      <button
        onClick={onDeleteNode}
        disabled={!isDeleteButtonActive}
        className={`delete-btn ${isDeleteButtonActive ? 'active' : 'inactive'}`}
      >
        Delete
      </button>
      <button onClick={onValidate} className="validate-btn">Validate</button>

      {showDropdown && (
        <div className="dropdown">
          <select onChange={handleSelectNode} value={selectedNode}>
            <option value="">Select Node</option>
            <option value="1">10th Class</option>
            <option value="2">12th Class</option>
            <option value="3">B.Tech</option>
            <option value="4">Experience 1</option>
            <option value="5">Experience 2</option>
            <option value="6">Experience 3</option>
          </select>
          <button onClick={handleAddSelectedNode}>Add {selectedNode && selectedNode}</button>
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
