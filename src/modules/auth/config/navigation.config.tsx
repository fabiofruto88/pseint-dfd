// src/config/navigation.config.tsx
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  requiredModule?: string; // Módulo del backend
  children?: NavigationItem[];
}

/**
 * Configuración del menú de navegación
 * Los items se muestran solo si el usuario tiene el módulo requerido
 */
export const navigationConfig: NavigationItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardIcon />,
    // Sin requiredModule = todos tienen acceso
  },
  {
    title: "Mi Perfil",
    path: "/perfil",
    icon: <PersonIcon />,
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icon: <PeopleIcon />,
    requiredModule: "usuarios", // ← Del backend
  },
  {
    title: "Productos",
    path: "/productos",
    icon: <InventoryIcon />,
    requiredModule: "productos",
    children: [
      {
        title: "Lista",
        path: "/productos/lista",
        icon: <InventoryIcon />,
        requiredModule: "productos",
      },
      {
        title: "Categorías",
        path: "/productos/categorias",
        icon: <InventoryIcon />,
        requiredModule: "productos",
      },
    ],
  },
  {
    title: "Reportes",
    path: "/reportes",
    icon: <AssessmentIcon />,
    requiredModule: "reportes",
  },
  {
    title: "Configuración",
    path: "/configuracion",
    icon: <SettingsIcon />,
    requiredModule: "configuracion",
  },
];
