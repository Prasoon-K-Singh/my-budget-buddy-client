import { Outlet } from "react-router";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ModeToggle } from "@/components/common/mode-toggle";

function AppLayout() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <Outlet />
      </div>
    </ThemeProvider>
  );
}

export default AppLayout;
