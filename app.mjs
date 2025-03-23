import { bfs } from './functions.mjs'; // 경로는 실제 위치에 맞게 수정

const app = Vue.createApp({
  data() {
    return {
      nodes: [],
      lines: [],
      selectedNode: null,
      currentLine: null,
      graphConnections: [],
      headerHeight: 0, // 헤더 높이 100px로 설정
      startIdx: 1,
    };
  },
  methods: {
    handleClick(event) {
      if (this.selectedNode !== null) return;

      const x = event.clientX;
      const y = event.clientY - this.headerHeight; // 헤더 고려

      for (const alreadyNode of this.nodes) {
        let ax = alreadyNode.x;
        let ay = alreadyNode.y;

        if (Math.sqrt((x - ax) * (x - ax) + (y - ay) * (y - ay)) <= 80) {
          alert('Too close');
          return;
        }
      }
      console.log(x, y);
      this.addNode(x, y);
    },
    addNode(x, y) {
      this.nodes.push({ x, y });
    },
    connectNode(index) {
      if (this.selectedNode === null) {
        this.selectedNode = index;
        window.addEventListener('mousemove', this.drawLine);
      } else {
        if (this.selectedNode !== index) {
          this.lines.push({
            x1: this.nodes[this.selectedNode].x,
            y1: this.nodes[this.selectedNode].y,
            x2: this.nodes[index].x,
            y2: this.nodes[index].y,
          });
          console.log(this.lines[this.lines.length-1]);
          this.graphConnections.push([this.selectedNode + 1, index + 1]);
          console.log(this.graphConnections[this.graphConnections.length-1]);

        }
        this.selectedNode = null;
        window.removeEventListener('mousemove', this.drawLine);
        this.currentLine = null;
      }
    },
    drawLine(event) {
      if (this.selectedNode !== null) {
        this.currentLine = {
          x1: this.nodes[this.selectedNode].x,
          y1: this.nodes[this.selectedNode].y,
          x2: event.clientX,
          y2: event.clientY - this.headerHeight, // 헤더 높이 고려
        };
      }
    },
    handleMouseDown(event) {
      if (event.button === 2) {
        event.preventDefault();
        this.selectedNode = null;
        this.currentLine = null;
        window.removeEventListener('mousemove', this.drawLine);
      }
    },
    clickBFSButton() {
      console.log('?')
      const { levels, orderIdx } = bfs(this.nodes, this.graphConnections, this.startIdx);
      console.log(levels);
      console.log(orderIdx); 
    },
  },
});

app.mount('#app');
