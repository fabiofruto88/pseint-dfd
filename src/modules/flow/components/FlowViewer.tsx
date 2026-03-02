import React, { useRef } from "react";
import { Box, Button, Typography, Stack } from "@mui/material";
import { FlowSvg } from "@/core/renderer/FlowSvg";
import type { PositionedGraph } from "@/shared/types/flow.types";

interface Props {
  graph: PositionedGraph;
}

export const FlowViewer: React.FC<Props> = ({ graph }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const exportSvg = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagrama.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const svgData = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(source)));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = svgRef.current!.viewBox.baseVal.width;
      canvas.height = svgRef.current!.viewBox.baseVal.height;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "diagrama.png";
      a.click();
    };
    img.src = svgData;
  };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ mb: 1.5 }} alignItems="center">
        <Typography variant="subtitle2" color="text.secondary" sx={{ flex: 1 }}>
          Diagrama de flujo
        </Typography>
        <Button size="small" variant="outlined" onClick={exportSvg}>
          Exportar SVG
        </Button>
        <Button size="small" variant="outlined" onClick={exportPng}>
          Exportar PNG
        </Button>
      </Stack>
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
          overflow: "auto",
          background: "#fff",
          minHeight: 300,
        }}
      >
        <FlowSvg graph={graph} svgRef={svgRef} />
      </Box>
    </Box>
  );
};
