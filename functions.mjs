import Queue from "./queue.mjs";


function makeGraph(n, lineGraph) {
  const graph = Array(n+1).fill().map(() => []);

  for (let line of lineGraph) {
    let u = line[0];
    let v = line[1];

    graph[u].push(v);
    graph[v].push(u);
  }

  console.log(graph)
  graph.forEach(line => line.sort((a, b) => a-b));

  return graph;
}


function bfs(nodes, lineGraph, startIdx=1) {
  const n = nodes.length;
  const graph = makeGraph(n, lineGraph);

  const q = new Queue();
  q.push([startIdx, 0]);

  const visited = Array(n+1).fill(false);
  visited[startIdx] = true;

  let level = 0;
  const sameLevel = [];
  const orderIdx = [];
  const levels = [];
  while (!q.isEmpty()) {
    let now = q.pop();
    let nowIdx = now[0];
    let nowLevel = now[1];

    if (level != nowLevel) {
      level = nowLevel;
      levels.push([...sameLevel]);
      sameLevel.length = 0;
    }

    sameLevel.push(nowIdx);
    orderIdx.push(nowIdx);
    
    for (let nxtIdx of graph[nowIdx]) {
      if (!visited[nxtIdx]) {
        visited[nxtIdx] = true;
        q.push([nxtIdx, nowLevel+1]);
      }
    }
  }

  levels.push([...sameLevel]);

  return {levels, orderIdx};
}

function dfs(nodes, lineGraph, startIdx=1) {
  let n = nodes.length;
  const graph = makeGraph(lineGraph);

  let dfsNodeOrder = [];
  let visited = Array(n+1).fill(false);

  dfs_recur(startIdx, dfsNodeOrder, visited, graph);

  return dfsNodeOrder;
}

function dfs_recur(nowIdx, dfsNodeOrder, visited, graph) {
  dfsNodeOrder.push(nowIdx);

  for (let nxtIdx of graph[nowIdx]) {
    if (!visited[nxtIdx]) {
      visited[nxtIdx] = true;
      dfs_recur(nxtIdx, dfsNodeOrder, visited, graph);
    }
  }
  
}

export { bfs, dfs };