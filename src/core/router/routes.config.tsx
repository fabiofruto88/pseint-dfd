import type { RouteConfig } from "@/modules/auth/types/auth.types";

// Layouts
/* import PublicLayout from "../layouts/PublicLayout";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout"; */

// Páginas públicas
import Home from "@/modules/home/pages/Home";
import Login from "@/modules/auth/pages/Login";
import Dashboard from "@/modules/admin/pages/Dashboard";
import FlowPage from "@/modules/flow/pages/FlowPage";

/* import Register from "../pages/public/Register"; */

// Páginas autenticadas

export const routes: RouteConfig[] = [
  // ==========================================
  // RUTAS PÚBLICAS (con PublicLayout)
  // ==========================================
  {
    path: "/",
    component: <Home />,
    isPublic: true,
    layout: "public",
    name: "Inicio",
  },
  {
    path: "/flow",
    component: <FlowPage />,
    isPublic: true,
    layout: "public",
    name: "DFD",
  },
  {
    path: "/login",
    component: <Login />,
    isPublic: true,
    layout: "public",
    name: "Login",
  },
  /*   {
    path: "/register",
    component: <Register />,
    isPublic: true,
    layout: "public",
    name: "Registrarse",
  }, */

  // ==========================================
  // RUTAS AUTENTICADAS (con AuthenticatedLayout)
  // ==========================================
  {
    path: "/dashboard",
    component: <Dashboard />,
    layout: "authenticated",
    name: "Dashboard",
  },
  /*  {
    path: "/perfil",
    component: <Profile />,
    layout: "authenticated",
    name: "Mi Perfil",
  },
  {
    path: "/usuarios",
    component: <Users />,
    requiredModule: "usuarios",
    layout: "authenticated",
    name: "Usuarios",
  },
  {
    path: "/productos",
    component: <Products />,
    requiredModule: "productos",
    layout: "authenticated",
    name: "Productos",
  },
  {
    path: "/reportes",
    component: <Reports />,
    requiredModule: "reportes",
    layout: "authenticated",
    name: "Reportes",
  },
  {
    path: "/configuracion",
    component: <Settings />,
    requiredModule: "configuracion",
    layout: "authenticated",
    name: "Configuración",
  }, */
];

export default routes;
