import { Outlet } from "react-router";
import { AuthProvider } from "@/context/authContext";

function AppLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

export default AppLayout;
