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
import { navItem } from "@/config/config";
import MobileMenu from "@/components/common/MobileMenu";

const Topbar = () => {
  const { handleLogout } = useAuth();
  const handleLogoutUser = () => {
    handleLogout();
  };

  return (
    <header className="w-full">
      <div className="flex lg:h-20 max-w-8xl items-center justify-between gap-8">
        <MobileMenu />
        <Link to="/dashboard" className="text-xl font-bold">
          MyBudgetBuddy
        </Link>
        <div className="hidden lg:flex gap-8 px-4 py-2 bg-primary/80 rounded-4xl">
          <NavigationMenu>
            <NavigationMenuList>
              {navItem.map((nav) => {
                return (
                  <NavigationMenuItem key={nav.link}>
                    <NavLink
                      to={nav.link}
                      className={({ isActive }) =>
                        `${navigationMenuTriggerStyle()} ${
                          isActive ? "bg-accent text-accent-foreground" : ""
                        }`
                      }
                    >
                      {nav.title}
                    </NavLink>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full outline-none">
              <Avatar className="cursor-pointer">
                <AvatarFallback>
                  <UserRound className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
