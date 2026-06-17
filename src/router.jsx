import { createBrowserRouter, Outlet } from "react-router";
import Singin from "@/components/pages/SingIn";
import AppLayout from "@/AppLayout";
import Dashboard from "@/components/pages/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Singin />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);
