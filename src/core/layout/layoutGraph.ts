import dagre from "dagre";
import type {
  FlowGraph,
  PositionedGraph,
  PositionedNode,
} from "@/shared/types/flow";

const approximateSize = (label: string) => {
  const padding = 24;
  const charWidth = 7;
  const width = Math.max(80, Math.min(360, padding + charWidth * label.length));
  const height = 44;
  return { width, height };
};

export const layoutGraph = (graph: FlowGraph): PositionedGraph => {
  const g = new dagre.graphlib.Graph();
  g.setGraph({ rankdir: "TB", nodesep: 50, ranksep: 70 });
  g.setDefaultEdgeLabel(() => ({}));

  graph.nodes.forEach((n) => {
    const { width, height } = approximateSize(n.label || "");
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
