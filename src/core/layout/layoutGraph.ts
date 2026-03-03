/* eslint-disable @typescript-eslint/no-explicit-any */
import dagre from "dagre";
import type {
  FlowGraph,
  PositionedGraph,
  PositionedNode,
} from "@/shared/types/flow";

/**
 * Must match measureText() in FlowViewer.tsx exactly
 * so dagre reserves the real rendered size.
 */
const PAD_X = 24;

const approximateSize = (label: string, type: string) => {
  const approx = label.length * 7.8 + PAD_X * 2;
  let width = Math.max(approx, 80);
  const height = 40;

  // Diamonds need extra horizontal space so dagre spreads branches apart,
  // but height stays the same so branch nodes are placed well below.
  if (type === "decision") {
    width *= 2.0;
  }

  return { width, height };
};

export const layoutGraph = (graph: FlowGraph): PositionedGraph => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 60, ranksep: 120 });
  g.setDefaultEdgeLabel(() => ({}));

  graph.nodes.forEach((n) => {
    const { width, height } = approximateSize(n.label || "", n.type);
    g.setNode(n.id, { ...n, width, height });
  });

  graph.edges.forEach((e) => g.setEdge(e.from, e.to, { label: e.label ?? "" }));

  dagre.layout(g);

  const nodes: PositionedNode[] = g.nodes().map((id: string) => {
    const n = g.node(id) as any;
    return {
      id,
      type: n.type,
      label: n.label,
      x: n.x,
      y: n.y,
      width: n.width,
      height: n.height,
    };
  });

  return { nodes, edges: graph.edges };
};
