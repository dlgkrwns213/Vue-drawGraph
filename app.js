const app = Vue.createApp({
  data() {
    return {
      nodes: [],          // 노드 목록
      lines: [],          // 이미 그려진 선 목록
      selectedNode: null, // 선택된 노드
      currentLine: null,  // 현재 마우스와 연결될 선
      graphConnections: [] // 연결된 그래프 정보 저장
    };
  },
  methods: {
    handleClick(event) {
      if (this.selectedNode !== null)
        return;
      this.addNode(event.clientX, event.clientY); // 클릭한 위치에 노드 추가
    },
    addNode(x, y) {
      this.nodes.push({ x, y }); // 새로운 노드 추가
    },
    connectNode(index) {
      if (this.selectedNode === null) {
        this.selectedNode = index; // 첫 번째 노드 선택
        // 마우스 이동 시 선을 그리도록 이벤트 리스너 추가
        window.addEventListener("mousemove", this.drawLine);
      } else {
        if (this.selectedNode !== index) {
          // 두 번째 노드 클릭 시 선 추가
          this.lines.push({
            x1: this.nodes[this.selectedNode].x,
            y1: this.nodes[this.selectedNode].y,
            x2: this.nodes[index].x,
            y2: this.nodes[index].y
          });
          this.graphConnections.push([this.selectedNode + 1, index + 1]); // 연결 저장
          console.log("Graph Connections:", this.graphConnections);
        }
        this.selectedNode = null;
        // 마우스 이동 이벤트 리스너 제거
        window.removeEventListener("mousemove", this.drawLine);
        this.currentLine = null; // 현재 선 초기화
      }
    },
    drawLine(event) {
      // 선택된 노드의 좌표와 마우스 좌표로 선을 그리기
      if (this.selectedNode !== null) {
        this.currentLine = {
          x1: this.nodes[this.selectedNode].x,
          y1: this.nodes[this.selectedNode].y,
          x2: event.clientX,
          y2: event.clientY
        };
      }
    },
  },
});
app.mount("#app");
