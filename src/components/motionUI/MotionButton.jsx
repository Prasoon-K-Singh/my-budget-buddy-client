import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { buttonConfigs } from "@/assets/motionConfig/buttonConfig";
import { cn } from "@/lib/utils";

const AnimatedButton = motion.create(Button);

function MotionButton({
  children,
  buttonConfig = "default",
  className,
  ...props
}) {
  const config = buttonConfigs[buttonConfig] ?? buttonConfigs.default;
  return (
    <AnimatedButton
      {...config}
      {...props}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </AnimatedButton>
  );
}

export default MotionButton;
