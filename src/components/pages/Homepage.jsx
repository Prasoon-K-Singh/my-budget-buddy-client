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
      <div className="min-h-screen grid grid-cols-12 items-center">
        <div className="col-span-12 lg:col-span-8 flex justify-center text-xl font-bold">
          My Budget Buddy
        </div>
        <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">
          <ModeToggle className="absolute right-8 top-8" />
          {isRegister ? <SignUp /> : <LogIn />}
          {isRegister ? (
            <div>
              <span>Already have account</span>
              <MotionButton
                variant="link"
                className="cursor-pointer"
                onClick={handleFormToggle}
              >
                Login
              </MotionButton>
            </div>
          ) : (
            <div>
              <span>Register here</span>
              <MotionButton
                variant="link"
                className="cursor-pointer"
                onClick={handleFormToggle}
              >
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
