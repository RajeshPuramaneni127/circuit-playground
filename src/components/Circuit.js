import React, { useCallback, useState } from 'react';
import ReactFlow, { addEdge, Background, Controls, MiniMap, useEdgesState, useNodesState } from 'react-flow-renderer';
import ControlPanel from './ControlPanel';
import NodeDetails from './NodeDetails';

const initialNodes = [
  { id: 'start', data: { label: 'Start Node' }, position: { x: 50, y: 300 }, type: 'input' },
  { id: 'end', data: { label: 'End Node' }, position: { x: 800, y: 300 }, type: 'output' }
];

const Circuit = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [connections, setConnections] = useState([]);
  const [isValid, setIsValid] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const educationNodes = [
    { id: '1', label: '10th Class' },
    { id: '2', label: '12th Class' },
    { id: '3', label: 'B.Tech' },
    { id: '4', label: 'Experience 1' },
    { id: '5', label: 'Experience 2' },
    { id: '6', label: 'Experience 3' }
  ];

  const onAddNode = useCallback(
    (nodeId) => {
      const nodeData = educationNodes.find((node) => node.id === nodeId);
      if (!nodeData) return;
      const xPos = Math.random() * 500 + 150;
      const yPos = Math.random() * 300 + 100;
      const newNode = {
        id: nodeData.id,
        data: { label: nodeData.label },
        position: { x: xPos, y: yPos },
        type: 'default'
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes, educationNodes]
  );

  const onDeleteNode = useCallback(() => {
    if (!selectedNode || selectedNode === 'start' || selectedNode === 'end') return;
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode && edge.target !== selectedNode));
    setSelectedNode(null);
  }, [selectedNode, setNodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, arrowHeadType: 'arrowclosed' }, eds)),
    [setEdges]
  );

  const onValidate = useCallback(() => {
    const isValid = validateCircuit();
    setIsValid(isValid);
    setShowDetails(true);
    if (isValid) {
      alert('Circuit is valid!');
      setConnections(edges);
    } else {
      alert('Circuit is invalid!');
      setConnections([]);
    }
  }, [edges]);

  const validateCircuit = () => {
    if (edges.some((edge) => (edge.source === 'start' && edge.target === 'end') || (edge.source === 'end' && edge.target === 'start'))) {
      return false;
    }
  
    if (!edges.some((edge) => edge.source === 'start') || !edges.some((edge) => edge.target === 'end')) {
      return false;
    }
  
    const connectionMap = edges.reduce((acc, edge) => {
      if (!acc[edge.source]) acc[edge.source] = [];
      acc[edge.source].push(edge.target);
      return acc;
    }, {});
  
    const isCircular = (node, visited = new Set(), stack = new Set()) => {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;
      visited.add(node);
      stack.add(node);
  
      if (connectionMap[node]) {
        for (const neighbor of connectionMap[node]) {
          if (isCircular(neighbor, visited, stack)) return true;
        }
      }
      stack.delete(node);
      return false;
    };
    if (isCircular('start')) return false;
  
    for (const edge of edges) {
      const isInvalidConnection = nodes.some((node) =>
        ((edge.source === node.id && edge.target === node.id) ||
        (edge.source === 'start' && node.id === edge.target && connectionMap[node.id]?.length > 1) ||
        (edge.target === 'end' && node.id === edge.source && connectionMap[edge.source]?.length > 1))
      );
      if (isInvalidConnection) return false;
    }
  
    const allNodesConnected = nodes.every((node) =>
      (node.id === 'start' && edges.some((edge) => edge.source === 'start')) ||
      (node.id === 'end' && edges.some((edge) => edge.target === 'end')) ||
      edges.some((edge) => edge.source === node.id || edge.target === node.id)
    );
  
    return allNodesConnected;
  };
  

  const hasCycle = (connections) => {
    const visited = new Set();
    const stack = new Set();
    const visitNode = (node) => {
      if (stack.has(node)) return true;
      if (visited.has(node)) return false;
      visited.add(node);
      stack.add(node);
      if (connections[node] && visitNode(connections[node])) return true;
      stack.delete(node);
      return false;
    };
    return Object.keys(connections).some(visitNode);
  };

  const handleNodeSelection = (nodeId) => {
    setSelectedNode(nodeId);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
  };

  return (
    <div className="circuit-container">
      <h1 className="circuit-title">Circuit Playground</h1>
      <ControlPanel
        onAddNode={onAddNode}
        onDeleteNode={onDeleteNode}
        onValidate={onValidate}
        isDeleteButtonActive={selectedNode !== null}
      />
      <div className="circuit-wrapper">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(event, node) => handleNodeSelection(node.id)}
          fitView
          style={{ width: '800px', height: '500px', border: '1px solid black' }}
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      </div>
      {showDetails && isValid !== null && (
        <NodeDetails
          connections={connections}
          isValid={isValid}
          onClose={handleCloseDetails}
          className={`node-details ${isValid ? 'valid' : 'invalid'} ${showDetails ? 'open' : ''}`}
        />
      )}
    </div>
  );
};

export default Circuit;
