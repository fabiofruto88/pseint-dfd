// src/layouts/components/AuthHeader.tsx
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Divider,
  List,
} from "@mui/material";
import { Bars3Icon } from "@heroicons/react/24/outline";
/* import { Hotel as HotelIcon } from "@mui/icons-material"; */
import { useState } from "react";
import { useAuth } from "../../../../../context/AuthContext";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useThemeContext } from "../../../../../context/theme-context";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";
import {
  navigationConfig,
  type NavigationItem,
} from "../../../../../modules/auth/config/navigation.config";
import { filterNavItems } from "../../../../utils/generals";
import NavItem from "./navItem";

interface AuthHeaderProps {
  onMenuClick: () => void;
}

export default function AuthHeader({ onMenuClick }: AuthHeaderProps) {
  const { user, logout, hasModule } = useAuth();
  const theme = useTheme();
  const navigate = useNavigate();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isDarkMode, toggleTheme } = useThemeContext();
  const isActive = (path: string) => location.pathname === path;
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };
  const handleItemClick = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      setOpenItems((prev) => ({
        ...prev,
        [item.path]: !prev[item.path],
      }));
    } else {
      navigate(item.path);
      handleClose();
    }
  };

  const availableItems = filterNavItems(navigationConfig, {
    hasModule,
    userRole: user?.role,
  });

  return (
    <AppBar position="sticky" color="inherit" elevation={0}>
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <Bars3Icon style={{ width: 24, height: 24 }} />
        </IconButton>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/*   <HotelIcon sx={{ color: "primary.main", fontSize: 28, mr: 1 }} /> */}
          <Typography variant="h6" component="div" fontWeight={800}>
            BASE
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />
        <IconButton onClick={toggleTheme} color="inherit">
          {isDarkMode ? (
            <SunIcon
              style={{ width: 24, height: 24 }}
              color={theme.palette.primary.dark}
            />
          ) : (
            <MoonIcon
              style={{ width: 24, height: 24 }}
              color={theme.palette.primary.dark}
            />
          )}
        </IconButton>

        <IconButton onClick={handleMenu} color="inherit">
          <Avatar
            sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.dark }}
          >
            {user?.name?.charAt(0) || "U"}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.role}
            </Typography>
          </Box>
          <Divider />
          <List sx={{ flex: 1 }}>
            {availableItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                openItems={openItems}
                handleItemClick={handleItemClick}
                isActive={isActive}
              />
            ))}
          </List>

          <Divider />
          <MenuItem
            sx={{ my: 1, mx: 1, borderRadius: 2 }}
            onClick={handleLogout}
          >
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
