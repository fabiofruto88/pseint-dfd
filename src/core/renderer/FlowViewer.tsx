import React, { useCallback, useMemo, useRef } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Box, Button, Stack, Typography } from "@mui/material";
import type {
  FlowEdge,
  PositionedGraph,
  PositionedNode,
} from "@/shared/types/flow";

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

// ── Diamond vertex helpers ───────────────────────────────
function diamondVertices(n: PositionedNode) {
  const { w, h, cx, cy } = nodeRect(n);
  const hw = w / 2;
  const hh = h / 2;
  return {
    top: { x: cx, y: cy - hh },
    bottom: { x: cx, y: cy + hh },
    left: { x: cx - hw, y: cy },
    right: { x: cx + hw, y: cy },
  };
}

/**
 * Return the exit point from a node towards a target.
 * For decision nodes, always use one of the 4 diamond vertices.
 * For other nodes, use the center of the closest edge (top/bottom/left/right).
 */
function getExitPoint(
  n: PositionedNode,
  target: PositionedNode,
  edgeLabel?: string,
): { x: number; y: number } {
  const { cx, cy } = nodeRect(n);

  if (n.type === "decision") {
    const v = diamondVertices(n);
    // Use label to determine exit vertex for Sí/No branches
    if (edgeLabel) {
      const lower = edgeLabel.toLowerCase().trim();
      if (lower === "sí" || lower === "si" || lower === "verdadero")
        return v.right;
      if (lower === "no" || lower === "falso") return v.left;
    }
    // Fallback: determine by relative position of target
    const dx = target.x - cx;
    const dy = target.y - cy;
    if (dx > 10) return v.right;
    if (dx < -10) return v.left;
    if (dy < 0) return v.top;
    return v.bottom;
  }

  // For non-diamond nodes, use center of the closest rectangular edge
  const { w, h } = measureText(n.label);
  const hw = w / 2;
  const hh = h / 2;
  const dx = target.x - cx;
  const dy = target.y - cy;

  if (Math.abs(dy) > Math.abs(dx)) {
    if (dy > 0) return { x: cx, y: cy + hh }; // bottom
    return { x: cx, y: cy - hh }; // top
  } else {
    if (dx > 0) return { x: cx + hw, y: cy }; // right
    return { x: cx - hw, y: cy }; // left
  }
}

/**
 * Return the entry point into a node coming from a source.
 * For decision nodes, use the appropriate diamond vertex.
 * For other nodes, use center of the closest rectangular edge.
 */
function getEntryPoint(
  n: PositionedNode,
  source: PositionedNode,
): { x: number; y: number } {
  const { cx, cy } = nodeRect(n);

  if (n.type === "decision") {
    const v = diamondVertices(n);
    const dx = source.x - cx;
    const dy = source.y - cy;
    if (dy < -10) return v.top;
    if (dy > 10) return v.bottom;
    if (dx > 10) return v.right;
    if (dx < -10) return v.left;
    return v.top;
  }

  const { w, h } = measureText(n.label);
  const hw = w / 2;
  const hh = h / 2;
  const dx = source.x - cx;
  const dy = source.y - cy;

  if (Math.abs(dy) > Math.abs(dx)) {
    if (dy < 0) return { x: cx, y: cy - hh }; // top
    return { x: cx, y: cy + hh }; // bottom
  } else {
    if (dx < 0) return { x: cx - hw, y: cy }; // left
    return { x: cx + hw, y: cy }; // right
  }
}

/**
 * Build an orthogonal SVG path (only H / V segments) between two nodes.
 * Returns the `d` attribute for a <path>, plus label position information.
 */
function orthogonalPath(
  fromNode: PositionedNode,
  toNode: PositionedNode,
  edgeLabel?: string,
  mergeFrom?: boolean,
  mergeTo?: boolean,
): {
  d: string;
  labelPos: { x: number; y: number };
  labelAnchor: "start" | "end" | "middle";
} {
  const fromPt = mergeFrom
    ? { x: fromNode.x, y: fromNode.y }
    : getExitPoint(fromNode, toNode, edgeLabel);
  const toPt = mergeTo
    ? { x: toNode.x, y: toNode.y }
    : getEntryPoint(toNode, fromNode);

  const isLateralExit =
    fromNode.type === "decision" && Math.abs(fromPt.y - fromNode.y) < 5; // exit is from left or right vertex

  let pathD: string;
  let labelPos: { x: number; y: number };
  let labelAnchor: "start" | "end" | "middle" = "middle";

  if (isLateralExit) {
    // Lateral exit from diamond: go horizontal to target X, then vertical to target Y
    pathD = `M ${fromPt.x} ${fromPt.y} H ${toPt.x} V ${toPt.y}`;
    // Label near the diamond vertex
    const offsetX = toPt.x > fromPt.x ? 8 : -8;
    labelPos = { x: fromPt.x + offsetX, y: fromPt.y - 6 };
    labelAnchor = toPt.x > fromPt.x ? "start" : "end";
  } else if (Math.abs(fromPt.x - toPt.x) < 2) {
    // Vertically aligned — straight vertical line
    pathD = `M ${fromPt.x} ${fromPt.y} V ${toPt.y}`;
    labelPos = { x: fromPt.x + 8, y: (fromPt.y + toPt.y) / 2 };
    labelAnchor = "start";
  } else {
    // General case: go down to midpoint Y, horizontal to align, then down to target
    const midY = (fromPt.y + toPt.y) / 2;
    pathD = `M ${fromPt.x} ${fromPt.y} V ${midY} H ${toPt.x} V ${toPt.y}`;
    labelPos = { x: (fromPt.x + toPt.x) / 2 + 6, y: midY - 4 };
    labelAnchor = "start";
  }

  return { d: pathD, labelPos, labelAnchor };
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

// ── Edge label with background ───────────────────────────
function EdgeLabel({
  x,
  y,
  label,
  anchor,
}: {
  x: number;
  y: number;
  label: string;
  anchor: "start" | "end" | "middle";
}) {
  const textW = label.length * 7 + 6;
  const textH = 14;
  let rectX = x - 3;
  if (anchor === "end") rectX = x - textW + 3;
  else if (anchor === "middle") rectX = x - textW / 2;

  return (
    <g>
      <rect
        x={rectX}
        y={y - textH + 2}
        width={textW}
        height={textH}
        fill="rgba(255,255,255,0.85)"
        rx={2}
        ry={2}
      />
      <text
        x={x}
        y={y}
        fontSize={11}
        fill="#555"
        textAnchor={anchor}
        dominantBaseline="auto"
      >
        {label}
      </text>
    </g>
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
    return {
      minX: mnX - 60,
      minY: mnY - 60,
      maxX: mxX + 60,
      maxY: mxY + 60,
    };
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

  // ── Build edge paths ───────────────────────────────────
  const edgePaths = useMemo(() => {
    return graph.edges.map((e: FlowEdge) => {
      const fromNode = nodeMap.get(e.from);
      const toNode = nodeMap.get(e.to);
      if (!fromNode || !toNode) return null;

      const { d, labelPos, labelAnchor } = orthogonalPath(
        fromNode,
        toNode,
        e.label,
        isMerge(e.from),
        isMerge(e.to),
      );

      return { edge: e, d, labelPos, labelAnchor };
    });
  }, [graph.edges, nodeMap, isMerge]);

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
              {edgePaths.map((ep, i) => {
                if (!ep) return null;
                return (
                  <g key={`e-${i}`}>
                    <path
                      d={ep.d}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={1.2}
                      markerEnd="url(#arrow)"
                    />
                    {ep.edge.label && (
                      <EdgeLabel
                        x={ep.labelPos.x}
                        y={ep.labelPos.y}
                        label={ep.edge.label}
                        anchor={ep.labelAnchor}
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes (skip merge nodes) */}
              {graph.nodes.map((n) => {
                if (n.label === "") return null;
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
