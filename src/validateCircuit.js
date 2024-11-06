export function validateCircuit(nodes, edges) {
    const startNode = nodes.find(node => node.id === 'start');
    const endNode = nodes.find(node => node.id === 'end');
  
    if (!startNode || !endNode) return false;
  
    // Create adjacency list from edges
    const adjList = nodes.reduce((acc, node) => ({ ...acc, [node.id]: [] }), {});
    edges.forEach(edge => adjList[edge.source].push(edge.target));
  
    // Check if all nodes are connected
    const visited = new Set();
    const dfs = (nodeId) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);
      adjList[nodeId].forEach(dfs);
    };
    dfs('start');
  
    const allConnected = nodes.every(node => visited.has(node.id) || node.id === 'end');
    const noDirectStartEnd = !edges.some(edge => edge.source === 'start' && edge.target === 'end');
    const startsAtStart = adjList['start'].length > 0;
    const endsAtEnd = edges.some(edge => edge.target === 'end');
  
    return allConnected && noDirectStartEnd && startsAtStart && endsAtEnd;
  }
  