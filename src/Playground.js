import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, MiniMap, Controls, Background } from 'react-flow-renderer';
import { validateCircuit } from './validateCircuit';

const Playground = () => {
  const [nodes, setNodes] = useState([
    { id: 'start', data: { label: 'Start Node' }, position: { x: 50, y: 200 }, type: 'input', draggable: true },
    { id: 'end', data: { label: 'End Node' }, position: { x: 500, y: 200 }, type: 'output', draggable: true },
  ]);
  const [edges, setEdges] = useState([]);

  const onNodesChange = useCallback((changes) => {
    setNodes((nds) => 
      nds.map((node) => {
        const change = changes.find((c) => c.id === node.id);
        return change ? { ...node, ...change } : node;
      })
    );
  }, []);

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, arrowHeadType: 'arrow' }, // Set edge properties for direction
          eds
        )
      ),
    [setEdges]
  );

  const addNode = () => {
    const newNode = {
      id: `node-${nodes.length}`,
      data: { label: `Node ${nodes.length}` },
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      draggable: true,
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const deleteNode = (nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
  };

  const validate = () => {
    const isValid = validateCircuit(nodes, edges);
    alert(isValid ? 'Circuit is valid!' : 'Circuit is invalid.');
  };

  return (
    <div className="playground">
      <div className="controls">
        <button onClick={addNode}>Add Node</button>
        <button onClick={() => deleteNode(prompt("Enter the node ID to delete:"))}>Delete Node</button>
        <button onClick={validate}>Validate Circuit</button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onConnect={onConnect}
        fitView
        style={{ width: '600px', height: '400px', border: '1px solid black' }}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default Playground;
