import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { buttonMotion } from "@/assets/motionConfig/buttonMotion";

const AnimatedButton = motion.create(Button);

function MotionButton({ children, ...props }) {
  return (
    <AnimatedButton {...buttonMotion} {...props}>
      {children}
    </AnimatedButton>
  );
}

export default MotionButton;
