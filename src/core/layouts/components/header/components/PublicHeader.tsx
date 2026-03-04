// src/layouts/components/PublicHeader.tsx
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SunIcon, MoonIcon, Bars3Icon } from "@heroicons/react/24/solid";
import { HiOutlineCpuChip } from "react-icons/hi2";

import { useThemeContext } from "../../../../../context/theme-context";

export default function PublicHeader() {
  const navigate = useNavigate();
  const theme = useTheme();
  const { isDarkMode, toggleTheme } = useThemeContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen((prev: boolean) => !prev);
  };

  const drawer = (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      onClick={() => setMobileOpen(false)}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <HiOutlineCpuChip size={24} color={theme.palette.primary.main} />
        <Typography variant="h6" fontWeight={800}>
          FlowPseud
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/flow")}>
            <ListItemText primary="Generador DFD" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>
              {isDarkMode ? (
                <SunIcon
                  style={{
                    width: 20,
                    height: 20,
                    color: theme.palette.primary.main,
                  }}
                />
              ) : (
                <MoonIcon
                  style={{
                    width: 20,
                    height: 20,
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </ListItemIcon>
            <ListItemText primary={isDarkMode ? "Modo claro" : "Modo oscuro"} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" color="inherit" elevation={0}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <Bars3Icon
              style={{
                width: 24,
                height: 24,
                color: theme.palette.text.primary,
              }}
            />
          </IconButton>

          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              gap: 1,
            }}
            onClick={() => navigate("/")}
          >
            <HiOutlineCpuChip size={28} color={theme.palette.primary.main} />
            <Typography variant="h6" component="div" fontWeight={800}>
              FlowPseud
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1} alignItems="center">
            {/* Desktop theme toggle */}
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              {isDarkMode ? (
                <SunIcon
                  style={{
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main,
                  }}
                />
              ) : (
                <MoonIcon
                  style={{
                    width: 24,
                    height: 24,
                    color: theme.palette.primary.main,
                  }}
                />
              )}
            </IconButton>

            <Button
              variant="contained"
              onClick={() => navigate("/flow")}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Generador DFD
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderTopRightRadius: 20,
            borderBottomRightRadius: 20,
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}
