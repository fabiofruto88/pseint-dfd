// Parser types
export interface ParserError {
  message: string;
  line: number;
  column: number;
  length?: number;
}

export interface ParseResult<T> {
  ast?: T;
  errors: ParserError[];
}

// AST types
export type AstStatement =
  | AstDefine
  | AstRead
  | AstWrite
  | AstAssign
  | AstIf
  | AstWhile;

export interface AstProgram {
  name: string;
  body: AstStatement[];
}

export interface AstDefine {
  kind: "define";
  name: string;
  varType: string;
}

export interface AstRead {
  kind: "read";
  variable: string;
}

export interface AstWrite {
  kind: "write";
  expression: string;
}

export interface AstAssign {
  kind: "assign";
  variable: string;
  expression: string;
}

export interface AstIf {
  kind: "if";
  condition: string;
  then: AstStatement[];
  else: AstStatement[];
}

export interface AstWhile {
  kind: "while";
  condition: string;
  body: AstStatement[];
}

// Flow graph types
export type FlowNodeType = "start" | "end" | "process" | "io" | "decision";

export interface FlowNode {
  id: string;
  type: FlowNodeType;
  label: string;
}

export interface FlowEdge {
  from: string;
  to: string;
  label?: "v" | "f";
}

export interface FlowGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

// Positioned graph types
export interface PositionedNode extends FlowNode {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PositionedEdge extends FlowEdge {
  points: Array<{ x: number; y: number }>;
}

export interface PositionedGraph {
  nodes: PositionedNode[];
  edges: PositionedEdge[];
  width: number;
  height: number;
}
