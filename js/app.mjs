import { bfs, dfs } from './functions.mjs'; // 경로는 실제 위치에 맞게 수정

const app = Vue.createApp({
  data() {
    return {
      nodes: [],
      lines: [],
      selectedNode: null,
      currentLine: null,
      graphConnections: [],
      headerHeight: 0, // 헤더 높이 100px로 설정
      startIdx: -1,
      nodeSelecting: [],
      nodeSelected: [],
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

      if (this.startIdx === -1) {
        this.nodeSelecting = [1];
        this.startIdx = 1;
      }
    },
    addNode(x, y) {
      this.nodes.push({ x, y });
    },
    connectNode(index, event) {
      if (event.ctrlKey) {
        this.startIdx = index+1;
        this.nodeSelecting = [this.startIdx];
        return;
      }
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

    // bfs 함수 버튼
    async clickBFSButton(level) {
      const { levels, orderIdx } = bfs(this.nodes, this.graphConnections, this.startIdx);

      if (level)
        await this.colorButton(levels, true);
      else
        await this.colorButton(orderIdx);
    },

    // dfs 함수 버튼
    async clickDFSButton() {
      const dfsNodeOrder = dfs(this.nodes, this.graphConnections, this.startIdx);
      
      this.colorButton(dfsNodeOrder);
    },

    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    async colorButton(Arrays, isMulti = false) {
      if (isMulti) {
        for (let now of Arrays) {
          console.log(now);
          this.nodeSelecting = [...now];
          this.nodeSelected.push([...now]);
          
          await this.delay(500);
        }
      } else {
        for (let idx = 0; idx < Arrays.length; idx++) {
          // 현재 노드를 nodeSelecting에 설정
          this.nodeSelecting = [Arrays[idx]]; 
          this.nodeSelected.push(Arrays[idx]); // 해당 인덱스를 nodeSelected에 추가
    
          // 0.5초(500ms) 대기
          await this.delay(500);
        }
      }
        
      // 1초 후 nodeSelected와 nodeSelecting 초기화
      await this.delay(1000);
      this.nodeSelected = [];
      this.nodeSelecting = [];
    },
  },
});

app.mount('#app');
