import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { routes, RouteConfig } from './routes/index'; // Corrected import path

// Helper function to recursively render routes from the configuration array
const renderRoutes = (routeConfig: RouteConfig[]) => {
  return routeConfig.map((route, index) => {
    // Directly return the Route component, inlining children check
    return (
      <Route key={route.path || index} path={route.path} element={route.element}>
        {route.children ? renderRoutes(route.children) : null}
      </Route>
    );
  });
};

const RoutesRenderer: React.FC = () => {
  return (
    <RouterRoutes>
      {renderRoutes(routes)}
    </RouterRoutes>
  );
};

export default RoutesRenderer; 