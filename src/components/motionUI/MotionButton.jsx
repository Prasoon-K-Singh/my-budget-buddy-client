import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { buttonConfig } from "@/assets/motionConfig/buttonConfig";

const AnimatedButton = motion.create(Button);

function MotionButton({ children, ...props }) {
  return (
    <AnimatedButton {...buttonConfig} {...props}>
      {children}
    </AnimatedButton>
  );
}

export default MotionButton;
