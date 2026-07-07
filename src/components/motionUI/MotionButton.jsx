import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { defaultButtonConfig } from "@/assets/motionConfig/buttonConfig";
import { cn } from "@/lib/utils";

const AnimatedButton = motion.create(Button);

function MotionButton({
  children,
  buttonConfig = defaultButtonConfig,
  className,
  ...props
}) {
  return (
    <AnimatedButton
      {...buttonConfig}
      {...props}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </AnimatedButton>
  );
}

export default MotionButton;
