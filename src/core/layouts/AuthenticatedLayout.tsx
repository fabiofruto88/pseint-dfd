// src/layouts/AuthenticatedLayout.tsx
import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AuthHeader from "./components/header/components/AuthHeader";
import Sidebar from "./components/header/components/Sidebar";
import Footer from "./components/footer/components/Footer";

export default function AuthenticatedLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <AuthHeader onMenuClick={toggleSidebar} />

      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
