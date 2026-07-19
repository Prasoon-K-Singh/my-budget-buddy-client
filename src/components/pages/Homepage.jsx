import { useState } from "react";
import { Navigate } from "react-router";
import LogIn from "@/components/common/LogIn";
import SignUp from "@/components/common/SignUp";
import MotionButton from "@/components/motionUI/MotionButton";
import { ModeToggle } from "@/components/common/ModeToggle";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/context/themeContext";
const Homepage = () => {
  const { user, loading } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  if (user) {
    return <Navigate to={"/dashboard"} />;
  }
  const handleFormToggle = () => {
    setIsRegister(!isRegister);
  };
  return (
    <ThemeProvider>
      <div className="bg-muted/60 min-h-screen flex flex-col justify-center items-center gap-8 p-4 pt-20">
        <div className="text-4xl font-bold">My Budget Buddy</div>
        <ModeToggle className="absolute right-8 top-8" />
        <div className="flex flex-col gap-4">
          {isRegister ? <SignUp /> : <LogIn />}
          {isRegister ? (
            <div>
              <span>Already have account</span>
              <MotionButton variant="link" onClick={handleFormToggle}>
                Login
              </MotionButton>
            </div>
          ) : (
            <div>
              <span>Register here</span>
              <MotionButton variant="link" onClick={handleFormToggle}>
                Sign up
              </MotionButton>
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Homepage;
