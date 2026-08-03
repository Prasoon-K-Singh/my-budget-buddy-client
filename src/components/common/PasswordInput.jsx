import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import MotionButton from "@/components/motionUI/MotionButton";

const PasswordInput = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={`pr-10 ${className ?? ""}`}
        {...props}
      />

      <MotionButton
        type="button"
        variant="ghost"
        size="icon"
        buttonConfig="dropdown"
        className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2 active:-translate-y-1/2"
        onClick={() => setShowPassword((prev) => !prev)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </MotionButton>
    </div>
  );
};

export default PasswordInput;
