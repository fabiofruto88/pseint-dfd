import React from "react";
import type { PositionedNode } from "@/shared/types/flow.types";

const COLORS = {
  start: { fill: "#f6dca8", stroke: "#c2a84a" },
  end: { fill: "#f6dca8", stroke: "#c2a84a" },
  process: { fill: "#f0f4c3", stroke: "#b8c026" },
  io: { fill: "#d1f7d1", stroke: "#5ac45a" },
  decision: { fill: "#d6e5ff", stroke: "#6699cc" },
};

function truncate(text: string, maxLen = 28) {
  return text.length > maxLen ? text.slice(0, maxLen - 1) + "…" : text;
}

interface Props {
  node: PositionedNode;
}

export const FlowNodeShape: React.FC<Props> = ({ node }) => {
  const { x, y, width, height, type, label, id } = node;
  const cx = x + width / 2;
  const cy = y + height / 2;
  const colors = COLORS[type] ?? COLORS.process;
  const displayLabel = truncate(label);

  const textEl = (
    <text
      x={cx}
      y={cy}
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize={13}
      fontFamily='"Inter","Segoe UI",sans-serif'
      fill="#2d2d2d"
    >
      {displayLabel}
      <title>{label}</title>
    </text>
  );

  let shape: React.ReactNode;

  if (type === "start" || type === "end") {
    // Pill / ellipse
    shape = (
      <ellipse
        cx={cx}
        cy={cy}
        rx={width / 2}
        ry={height / 2}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.5}
        filter="url(#shadow)"
      />
    );
  } else if (type === "process") {
    // Rounded rectangle
    shape = (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        ry={8}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.5}
        filter="url(#shadow)"
      />
    );
  } else if (type === "io") {
    // Parallelogram
    const skew = 12;
    const pts = [
      `${x + skew},${y}`,
      `${x + width},${y}`,
      `${x + width - skew},${y + height}`,
      `${x},${y + height}`,
    ].join(" ");
    shape = (
      <polygon
        points={pts}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.5}
        filter="url(#shadow)"
      />
    );
  } else if (type === "decision") {
    // Diamond
    const pts = [
      `${cx},${y}`,
      `${x + width},${cy}`,
      `${cx},${y + height}`,
      `${x},${cy}`,
    ].join(" ");
    shape = (
      <polygon
        points={pts}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.5}
        filter="url(#shadow)"
      />
    );
  }

  return (
    <g id={id}>
      {shape}
      {textEl}
    </g>
  );
};
