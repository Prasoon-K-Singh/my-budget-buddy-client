import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { ThemeProvider } from "@/context/themeContext";
import LoadingScreen from "@/components/common/LoadingScreen";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <ThemeProvider>
        <LoadingScreen />
      </ThemeProvider>
    );
  }

  if (!user) {
    return <Navigate to={"/"} />;
  }
  return children;
};

export default Protected;
