export type FlowNodeType = "start" | "end" | "process" | "io" | "decision";

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  label: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: string;
}

export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface PositionedNode extends FlowNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionedGraph {
  nodes: PositionedNode[];
  edges: FlowEdge[];
}
