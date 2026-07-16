import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeProvider } from "@/context/themeContext";
import { ModeToggle } from "@/components/common/ModeToggle";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { NavLink, Link } from "react-router";

import { LogOut, UserRound } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Topbar = () => {
  const { handleLogout } = useAuth();
  const handleLogoutUser = () => {
    handleLogout();
  };

  return (
    <header className="w-full">
      <div className="flex h-20 max-w-8xl items-center justify-center gap-12">
        {/* Logo */}
        <Link to="/dashboard" className="text-xl font-bold">
          My Budget Buddy
        </Link>

        <div className="flex gap-8 px-4 py-2 bg-primary rounded-4xl">
          {/* Navigation Links */}
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavLink
                  to="/dashboard"
                  end
                  className={({ isActive }) =>
                    `${navigationMenuTriggerStyle()} ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="/expenses"
                  className={({ isActive }) =>
                    `${navigationMenuTriggerStyle()} ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`
                  }
                >
                  Expenses
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="/budgets"
                  className={({ isActive }) =>
                    `${navigationMenuTriggerStyle()} ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`
                  }
                >
                  Budget Builder
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="/goals"
                  className={({ isActive }) =>
                    `${navigationMenuTriggerStyle()} ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`
                  }
                >
                  Goal Tracker
                </NavLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `${navigationMenuTriggerStyle()} ${
                      isActive ? "bg-accent text-accent-foreground" : ""
                    }`
                  }
                >
                  Profile
                </NavLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none">
              <Avatar className="cursor-pointer">
                <AvatarFallback>
                  <UserRound className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {/* <DropdownMenuItem
                asChild
                className="flex items-center justify-between gap-4"
              >
                <Link to="/profile" className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <UserRound className="h-4 w-4" />
                    Profile
                  </div>
                  <Check className="h-4 w-4" />
                </Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={handleLogoutUser}
                className="cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <ModeToggle />
          </ThemeProvider>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
