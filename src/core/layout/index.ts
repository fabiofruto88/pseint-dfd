import dagre from "dagre";
import type { FlowGraph, PositionedGraph, PositionedNode, PositionedEdge } from "@/shared/types/flow.types";

const NODE_WIDTH_BASE = 40;
const NODE_WIDTH_PER_CHAR = 7;
const NODE_WIDTH_MAX = 220;
const NODE_HEIGHT = 50;
const DECISION_HEIGHT = 60;

function getNodeDimensions(type: string, label: string) {
  const width = Math.min(NODE_WIDTH_MAX, NODE_WIDTH_BASE + NODE_WIDTH_PER_CHAR * label.length);
  const height = type === "decision" ? DECISION_HEIGHT : NODE_HEIGHT;
  return { width: Math.max(width, 80), height };
}

export function layoutGraph(flow: FlowGraph): PositionedGraph {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 70, marginx: 20, marginy: 20 });
  g.setDefaultEdgeLabel(() => ({}));

  for (const node of flow.nodes) {
    const { width, height } = getNodeDimensions(node.type, node.label);
    g.setNode(node.id, { label: node.label, width, height });
  }

  for (const edge of flow.edges) {
    g.setEdge(edge.from, edge.to, { label: edge.label ?? "" });
  }

  dagre.layout(g);

  const positionedNodes: PositionedNode[] = flow.nodes.map((node) => {
    const n = g.node(node.id);
    return {
      ...node,
      x: n.x - n.width / 2,
      y: n.y - n.height / 2,
      width: n.width,
      height: n.height,
    };
  });

  const positionedEdges: PositionedEdge[] = flow.edges.map((edge) => {
    const e = g.edge(edge.from, edge.to);
    return {
      ...edge,
      points: e?.points ?? [],
    };
  });

  const graphData = g.graph() as { width?: number; height?: number };
  return {
    nodes: positionedNodes,
    edges: positionedEdges,
    width: graphData.width ?? 400,
    height: graphData.height ?? 400,
  };
}
