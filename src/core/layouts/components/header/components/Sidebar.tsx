import {
  Drawer,
  List,
  Box,
  Divider,
  Typography,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../../../context/AuthContext";
import {
  navigationConfig,
  type NavigationItem,
} from "../../../../../modules/auth/config/navigation.config";
import { filterNavItems } from "../../../../utils/generals";
import NavItem from "./navItem";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  drawerWidth?: number;
}

export default function Sidebar({
  open,
  onClose,
  drawerWidth = 240,
}: SidebarProps) {
  const { user, hasModule, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({});
  const availableItems = filterNavItems(navigationConfig, {
    hasModule,
    userRole: user?.role,
  });

  const handleItemClick = (item: NavigationItem) => {
    if (item.children && item.children.length > 0) {
      setOpenItems((prev) => ({
        ...prev,
        [item.path]: !prev[item.path],
      }));
    } else {
      navigate(item.path);
      onClose();
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        border: "none",

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          borderTopRightRadius: 20,
          borderBottomRightRadius: 20,
          border: "none",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{user?.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
        <Chip label={user?.role} size="small" sx={{ mt: 1 }} />
      </Box>

      <Divider />

      <Stack
        sx={{
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
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
        <Box>
          <Divider sx={{ width: "100%", mb: 1 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",

              padding: 1,
            }}
          >
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={logout}
              sx={{ borderRadius: 2 }}
            >
              Cerrar Sesión
            </Button>
          </Box>
        </Box>
      </Stack>
    </Drawer>
  );
}
