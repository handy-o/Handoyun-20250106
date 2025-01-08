import {
  Navigate,
  Outlet,
  ScrollRestoration,
  createBrowserRouter,
} from "react-router-dom";
import { TimeDeal, BrandDeal } from "@/pages";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const webPath = {
  timeDeal: () => "/deals/time-deal",
  brandDeal: () => "/deals/brand-deal",
};

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return children;
};

const queryClient = new QueryClient()

const Root = () => {
  return (
    <MainLayout>
      <QueryClientProvider client={queryClient}>
        <Suspense
          fallback={
            <div className="h-full w-full flex items-center justify-center">
              로딩중
            </div>
          }
        >
          <Outlet />
          <ReactQueryDevtools initialIsOpen={false} />
        </Suspense>
      </QueryClientProvider>
      <ScrollRestoration />
    </MainLayout>
  );
};

const routes = [
  { path: "*", element: <div>404 Not Found</div> },
  {
    path: "/",
    element: <Root />,
    children: [
      { path: "/", element: <Navigate to={webPath.timeDeal()} replace /> },
      { path: webPath.timeDeal(), element: <TimeDeal /> },
      { path: webPath.brandDeal(), element: <BrandDeal /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
