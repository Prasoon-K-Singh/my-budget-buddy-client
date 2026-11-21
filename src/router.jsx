import { createBrowserRouter } from "react-router";
import AppLayout from "@/AppLayout";
import Protected from "@/components/common/Protected";
import Homepage from "@/components/pages/Homepage";
import Dashboard from "@/components/pages/Dashboard";
import ErrorPage from "@/components/pages/ErrorPage";
import Profile from "@/components/pages/Profile";
import Expenses from "@/components/pages/Expenses";
import BudgetBuilder from "@/components/pages/BudgetBuilder";
import Bills from "@/components/pages/Bills";

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
        path: "/expenses",
        element: (
          <Protected>
            <Expenses />
          </Protected>
        ),
      },
      {
        path: "/budgets",
        element: (
          <Protected>
            <BudgetBuilder />
          </Protected>
        ),
      },
      {
        path: "/bills",
        element: (
          <Protected>
            <Bills />
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
