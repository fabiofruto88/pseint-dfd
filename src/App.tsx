// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./core/router/ProtectedRoute";
import PublicLayout from "./core/layouts/PublicLayout";
import AuthenticatedLayout from "./core/layouts/AuthenticatedLayout";
import routes from "./core/router/routes.config";
import NotFound from "./modules/auth/pages/NotFound";
import NoPermission from "./modules/auth/pages/NoPermission";

function App() {
  // Separar rutas por layout
  const publicRoutes = routes.filter((r) => r.layout === "public");
  const authRoutes = routes.filter((r) => r.layout === "authenticated");

  return (
    <Routes>
      {/* Rutas públicas con PublicLayout */}
      <Route element={<PublicLayout />}>
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute isPublic={route.isPublic}>
                {route.component}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Rutas autenticadas con AuthenticatedLayout */}
      <Route element={<AuthenticatedLayout />}>
        {authRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute
                requiredModule={route.requiredModule}
                requiredModules={route.requiredModules}
                requireAllModules={route.requireAllModules}
              >
                {route.component}
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Rutas especiales */}
      <Route path="/sin-permiso" element={<NoPermission />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
