import { Moon, Sun, Monitor, Check } from "lucide-react";
import MotionButton from "@/components/motionUI/MotionButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/context/themeContext";
import { DropdownButtonConfig } from "@/assets/motionConfig/buttonConfig";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
];

export function ModeToggle({ className }) {
  const { theme, setTheme } = useTheme();

  const current = themes.find((t) => t.value === theme);
  const Icon = current?.icon ?? Sun;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MotionButton
          variant="secondary"
          size="lg"
          buttonConfig={DropdownButtonConfig}
          className={className}
        >
          <Icon className="h-4 w-4" />
          <span>{current?.label}</span>
        </MotionButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map(({ value, label, icon: ItemIcon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2">
              <ItemIcon className="h-4 w-4" />
              {label}
            </div>
            {theme === value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
