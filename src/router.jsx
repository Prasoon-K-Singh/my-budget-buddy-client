import { createBrowserRouter } from "react-router";
import AppLayout from "@/AppLayout";
import Protected from "@/components/common/Protected";
import Homepage from "@/components/pages/Homepage";
import Dashboard from "@/components/pages/Dashboard";
import Test from "@/components/pages/Test";
import ErrorPage from "@/components/pages/ErrorPage";
import Profile from "@/components/pages/Profile";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Homepage />,
      },
      {
        path: "/dashboard",
        element: (
          <Protected>
            <Dashboard />
          </Protected>
        ),
      },
      {
        path: "/test",
        element: (
          <Protected>
            <Test />
          </Protected>
        ),
      },
      {
        path: "/profile",
        element: (
          <Protected>
            <Profile />
          </Protected>
        ),
      },
    ],
  },
]);
