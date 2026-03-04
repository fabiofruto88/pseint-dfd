import { Routes, Route } from "react-router-dom";
import PublicLayout from "./core/layouts/PublicLayout";
import routes from "./core/router/routes.config";
import NotFound from "./modules/auth/pages/NotFound";

function App() {
  return (
    <Routes>
      {/* Rutas públicas con PublicLayout */}
      <Route element={<PublicLayout />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
