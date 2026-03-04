import type { RouteConfig } from "@/modules/auth/types/auth.types";

import Home from "@/modules/home/pages/Home";
import FlowPage from "@/modules/flow/pages/FlowPage";

export const routes: RouteConfig[] = [
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
    name: "Generador DFD",
  },
];

export default routes;
