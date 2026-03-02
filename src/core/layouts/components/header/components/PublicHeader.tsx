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
import { Hotel as HotelIcon } from "@mui/icons-material";
import {
  SunIcon,
  MoonIcon,
  HomeIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";

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
      <Box sx={{ p: 2, display: "flex", alignItems: "center" }}>
        <HotelIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} />
        <Typography variant="h6" fontWeight={800}>
          BASE
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/")}>
            <ListItemIcon>
              <HomeIcon
                style={{
                  width: 20,
                  height: 20,
                  color: theme.palette.primary.main,
                }}
              />
            </ListItemIcon>
            <ListItemText primary="Inicio" />
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
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/register")}>
            <ListItemText primary="Registrarse" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/login")}>
            <ListItemText primary="Iniciar Sesión" />
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
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            {/*        <HotelIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} /> */}
            <Typography variant="h6" component="div" fontWeight={800}>
              BASE
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

            {/* Desktop navigation */}
            <Button
              color="inherit"
              startIcon={
                <HomeIcon
                  style={{
                    width: 20,
                    height: 20,
                    color: theme.palette.primary.main,
                  }}
                />
              }
              sx={{ display: { xs: "none", md: "inline-flex" } }}
              onClick={() => navigate("/")}
            >
              Inicio
            </Button>

            <Button
              color="inherit"
              onClick={() => navigate("/register")}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Registrarse
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/login")}
              sx={{ display: { xs: "none", md: "inline-flex" } }}
            >
              Iniciar Sesión
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
