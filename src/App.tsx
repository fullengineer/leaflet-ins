import { useState, type ReactNode } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import type { LoaderFunction, ActionFunction } from "react-router-dom";

import { User } from "./config/lcStorage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getUser } from "./config/auth";

interface RouteCommon {
  loader?: LoaderFunction;
  action?: ActionFunction;
  ErrorBoundary?: React.ComponentType<unknown>;
}

interface IRoute extends RouteCommon {
  path: string;
  isPublic: boolean;
  Element: React.ComponentType<unknown>;
}

interface Pages {
  [key: string]: {
    default: React.ComponentType<unknown>;
  } & RouteCommon;
}

const PUBLIC_ROUTES = ["login"];

const pages: Pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

const routes: IRoute[] = [];
for (const path of Object.keys(pages)) {
  const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
  if (!fileName) {
    continue;
  }

  const normalizedPathName = fileName.includes("$")
    ? fileName.replace("$", ":")
    : fileName.replace(/\/index/, "");
  const normalizedPathNameLowerCase = normalizedPathName.toLowerCase();
  const routePath =
    fileName === "index" ? "/" : `/${normalizedPathNameLowerCase}`;

  routes.push({
    path: routePath,
    Element: pages[path].default,
    loader: pages[path]?.loader,
    action: pages[path]?.action,
    ErrorBoundary: pages[path]?.ErrorBoundary,
    isPublic: PUBLIC_ROUTES.includes(normalizedPathNameLowerCase),
  });
}

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const user: User | null = getUser();

  if (!user?.email) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter(
  routes.map(({ Element, ErrorBoundary, isPublic, ...rest }) => ({
    ...rest,
    element: isPublic ? (
      <Element />
    ) : (
      <ProtectedRoute>
        <Element />
      </ProtectedRoute>
    ),
    ...(ErrorBoundary && { errorElement: <ErrorBoundary /> }),
  }))
);

const App = () => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </>
  );
};

export default App;
