import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { register, login, logout } from "@/services/authApi";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { setUser, setLoading } = context;

  const handleRegister = async (payload) => {
    setLoading(true);
    try {
      const data = await register(payload);
      setUser(data.user);
      return data;
    } catch (err) {
      return (
        err?.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (payload) => {
    setLoading(true);
    try {
      const data = await login(payload);
      setUser(data.user);
      return data;
    } catch (err) {
      return (
        err?.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
    } catch (err) {
      return (
        err?.response?.data || {
          success: false,
          message: "Something went wrong",
        }
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    ...context,
    handleRegister,
    handleLogin,
    handleLogout,
  };
};
