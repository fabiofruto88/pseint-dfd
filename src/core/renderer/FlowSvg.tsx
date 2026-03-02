import React from "react";
import type { PositionedGraph, PositionedEdge } from "@/shared/types/flow.types";
import { FlowNodeShape } from "./FlowNodeShape";

interface Props {
  graph: PositionedGraph;
  svgRef?: React.RefObject<SVGSVGElement | null>;
}

function edgePath(edge: PositionedEdge): string {
  if (!edge.points || edge.points.length < 2) return "";
  const [first, ...rest] = edge.points;
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
}

function midPoint(points: Array<{ x: number; y: number }>) {
  const mid = Math.floor(points.length / 2);
  return points[mid] ?? { x: 0, y: 0 };
}

export const FlowSvg: React.FC<Props> = ({ graph, svgRef }) => {
  const padding = 20;
  const svgWidth = graph.width + padding * 2;
  const svgHeight = graph.height + padding * 2;

  return (
    <svg
      ref={svgRef}
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.12" />
        </filter>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#d9534f" />
        </marker>
      </defs>

      <g transform={`translate(${padding}, ${padding})`}>
        {/* Edges */}
        {graph.edges.map((edge, i) => {
          const d = edgePath(edge);
          if (!d) return null;
          const mid = midPoint(edge.points);
          return (
            <g key={`edge-${i}`}>
              <path
                d={d}
                fill="none"
                stroke="#d9534f"
                strokeWidth={1.5}
                markerEnd="url(#arrowhead)"
              />
              {edge.label && (
                <text
                  x={mid.x + 4}
                  y={mid.y - 4}
                  fontSize={11}
                  fontFamily='"Inter","Segoe UI",sans-serif'
                  fill="#d9534f"
                  fontWeight="bold"
                >
                  {edge.label}
                </text>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {graph.nodes.map((node) => (
          <FlowNodeShape key={node.id} node={node} />
        ))}
      </g>
    </svg>
  );
};
