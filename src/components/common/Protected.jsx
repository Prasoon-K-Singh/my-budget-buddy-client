import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Spinner } from "@/components/ui/spinner";
import { ThemeProvider } from "@/context/themeContext";

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen flex justify-center items-center gap-4">
          <Spinner className="size-8" />
        </div>
      </ThemeProvider>
    );
  }

  if (!user) {
    return <Navigate to={"/"} />;
  }
  return children;
};

export default Protected;
