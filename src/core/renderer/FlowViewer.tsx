import React, { useCallback, useMemo, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box, Button, Stack, Typography } from "@mui/material";
import type { PositionedGraph, PositionedNode } from "@/shared/types/flow";

// ── Palette ──────────────────────────────────────────────
const colors: Record<string, string> = {
  start: "#f6dca8",
  end: "#f6dca8",
  process: "#f0f4c3",
  io: "#d1f7d1",
  decision: "#d1e8ff",
};
const strokeColor = "#333";
const FONT = '13px "Segoe UI", Roboto, sans-serif';

// ── Geometry helpers ─────────────────────────────────────
const PAD_X = 24;
// const PAD_Y = 12;

function measureText(text: string): { w: number; h: number } {
  const approx = text.length * 7.8 + PAD_X * 2;
  return { w: Math.max(approx, 80), h: 40 };
}

function nodeRect(n: PositionedNode) {
  const { w, h } = measureText(n.label);
  return {
    x: n.x - w / 2,
    y: n.y - h / 2,
    w,
    h,
    cx: n.x,
    cy: n.y,
  };
}

/** Return the point on the border of `node` closest to `target`. */
function borderPoint(
  n: PositionedNode,
  target: { x: number; y: number },
): { x: number; y: number } {
  const { w, h, cx, cy } = nodeRect(n);

  if (n.type === "decision") {
    // Diamond: find intersection with diamond edges
    const hw = w / 2;
    const hh = h / 2;
    const dx = target.x - cx;
    const dy = target.y - cy;
    const absDx = Math.abs(dx) || 0.001;
    const absDy = Math.abs(dy) || 0.001;
    const scale = Math.min(hw / absDx, hh / absDy);
    return { x: cx + dx * scale, y: cy + dy * scale };
  }

  // Rectangle: clamp to edge
  const hw = w / 2;
  const hh = h / 2;
  const dx = target.x - cx;
  const dy = target.y - cy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy + hh };
  const absDx = Math.abs(dx) || 0.001;
  const absDy = Math.abs(dy) || 0.001;
  const scale = Math.min(hw / absDx, hh / absDy);
  return { x: cx + dx * scale, y: cy + dy * scale };
}

// ── Node shapes ──────────────────────────────────────────
function renderShape(n: PositionedNode) {
  const { x, y, w, h } = nodeRect(n);
  const fill = colors[n.type] ?? "#fff";

  switch (n.type) {
    case "start":
    case "end":
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx={h / 2}
          ry={h / 2}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      );
    case "decision":
      return (
        <polygon
          points={`${n.x},${y} ${x + w},${n.y} ${n.x},${y + h} ${x},${n.y}`}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      );
    case "io": {
      // Parallelogram
      const skew = 12;
      return (
        <polygon
          points={`${x + skew},${y} ${x + w},${y} ${x + w - skew},${y + h} ${x},${y + h}`}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      );
    }
    default:
      return (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          fill={fill}
          stroke={strokeColor}
          strokeWidth={1.5}
        />
      );
  }
}

// ── Arrowhead marker ─────────────────────────────────────
function ArrowDefs() {
  return (
    <defs>
      <marker
        id="arrow"
        markerWidth="10"
        markerHeight="7"
        refX="10"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill={strokeColor} />
      </marker>
    </defs>
  );
}

// ── Component ────────────────────────────────────────────
interface Props {
  graph: PositionedGraph;
}

const FlowViewer: React.FC<Props> = ({ graph }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeMap = useMemo(() => {
    const m = new Map<string, PositionedNode>();
    graph.nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [graph]);

  // Determine which nodes are "merge" (invisible) — label === ""
  const isMerge = useCallback(
    (id: string) => {
      const n = nodeMap.get(id);
      return n ? n.label === "" : false;
    },
    [nodeMap],
  );

  // Bounding box
  const { minX, minY, maxX, maxY } = useMemo(() => {
    let mnX = Infinity,
      mnY = Infinity,
      mxX = -Infinity,
      mxY = -Infinity;
    graph.nodes.forEach((n) => {
      const { x, y, w, h } = nodeRect(n);
      mnX = Math.min(mnX, x);
      mnY = Math.min(mnY, y);
      mxX = Math.max(mxX, x + w);
      mxY = Math.max(mxY, y + h);
    });
    return { minX: mnX - 40, minY: mnY - 40, maxX: mxX + 40, maxY: mxY + 40 };
  }, [graph]);

  const svgWidth = maxX - minX;
  const svgHeight = maxY - minY;

  // ── PNG export ─────────────────────────────────────────
  const exportPng = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = svgWidth * scale;
      canvas.height = svgHeight * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      const a = document.createElement("a");
      a.download = "diagrama.png";
      a.href = canvas.toDataURL("image/png");
      a.click();
    };
    img.src = url;
  }, [svgWidth, svgHeight]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
          Diagrama de Flujo
        </Typography>
        <Button size="small" variant="outlined" onClick={exportPng}>
          Exportar PNG
        </Button>
      </Stack>

      <Box
        sx={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "#fafafa",
        }}
      >
        <TransformWrapper
          initialScale={1}
          minScale={0.2}
          maxScale={3}
          centerOnInit
        >
          <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }}>
            <svg
              ref={svgRef}
              xmlns="http://www.w3.org/2000/svg"
              width={svgWidth}
              height={svgHeight}
              viewBox={`${minX} ${minY} ${svgWidth} ${svgHeight}`}
              style={{ fontFamily: '"Segoe UI", Roboto, sans-serif' }}
            >
              <ArrowDefs />

              {/* Edges */}
              {graph.edges.map((e, i) => {
                const fromNode = nodeMap.get(e.from);
                const toNode = nodeMap.get(e.to);
                if (!fromNode || !toNode) return null;

                // If from or to is a merge node, use its center directly
                const fromPt = isMerge(e.from)
                  ? { x: fromNode.x, y: fromNode.y }
                  : borderPoint(fromNode, toNode);
                const toPt = isMerge(e.to)
                  ? { x: toNode.x, y: toNode.y }
                  : borderPoint(toNode, fromNode);

                return (
                  <g key={`e-${i}`}>
                    <line
                      x1={fromPt.x}
                      y1={fromPt.y}
                      x2={toPt.x}
                      y2={toPt.y}
                      stroke={strokeColor}
                      strokeWidth={1.2}
                      markerEnd="url(#arrow)"
                    />
                    {e.label && (
                      <text
                        x={(fromPt.x + toPt.x) / 2 + 6}
                        y={(fromPt.y + toPt.y) / 2 - 4}
                        fontSize={11}
                        fill="#555"
                      >
                        {e.label}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Nodes (skip merge nodes) */}
              {graph.nodes.map((n) => {
                if (n.label === "") return null; // merge node – invisible
                return (
                  <g key={n.id}>
                    {renderShape(n)}
                    <text
                      x={n.x}
                      y={n.y + 4}
                      textAnchor="middle"
                      fontSize={13}
                      fill="#222"
                      style={{ font: FONT }}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </Box>
    </Box>
  );
};

export default FlowViewer;
