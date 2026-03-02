// src/layouts/PublicLayout.tsx
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import PublicHeader from "./components/header/components/PublicHeader";
import Footer from "./components/footer/components/Footer";

export default function PublicLayout() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <PublicHeader />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
}
