import { Menu } from "lucide-react";
import { NavLink } from "react-router";
import MotionButton from "@/components/motionUI/MotionButton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { navItem } from "@/config/config";

const MobileMenu = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <MotionButton variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </MotionButton>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 gap-1">
        <SheetHeader>
          <SheetTitle>My Budget Buddy</SheetTitle>
          <VisuallyHidden>
            <SheetDescription>
              Navigate to different sections of MyBudgetBuddy.
            </SheetDescription>
          </VisuallyHidden>
        </SheetHeader>
        <div className="mt-1 px-2 flex flex-col gap-1">
          {navItem.map((nav) => {
            return (
              <NavLink
                key={nav.link}
                to={nav.link}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`
                }
              >
                {nav.title}
              </NavLink>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
