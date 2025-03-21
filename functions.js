const Queue = require("./queue");


function makeGraph(n, lineGraph) {
  const graph = Array(n+1).fill().map(() => []);

  for (line of lineGraph) {
    let u = line[0];
    let v = line[1];

    graph[u].push(v);
    graph[v].push(u);
  }

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
    
    for (nxtIdx of graph[nowIdx]) {
      if (!visited[nxtIdx]) {
        visited[nxtIdx] = true;
        q.push([nxtIdx, nowLevel+1]);
      }
    }
  }

  return {levels, orderIdx};
}

const nodes = [
  { x: 242, y: 223 },
  { x: 205, y: 477 },
  { x: 484, y: 469 },
  { x: 458, y: 266 },
  { x: 345, y: 585 },
  { x: 655, y: 385 },
  { x: 671, y: 164 }
];

const lineGraph = [
  [1, 2],
  [2, 3],
  [3, 4],
  [3, 6],
  [3, 5],
  [1, 4],
  [2, 5]
];


let tt = bfs(nodes, lineGraph);

console.log(tt)
console.log(tt.levels);
console.log(tt.orderIdx);