export type Node = {
  id: string;
  label: string;
};

export type Edge = {
  source: string;
  target: string;
  weight: string;
};
export class Graph {
  nodes: Node[];
  edges: Edge[];

  constructor() {
    this.nodes = [];
    this.edges = [];
  }

  addNode(node: Node): void {
    this.nodes.push(node);
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }
}
