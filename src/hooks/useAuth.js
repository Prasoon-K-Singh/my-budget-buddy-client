import { useContext } from "react";
import { AuthContext } from "@/context/authContext";
import { register, login, logout, getMe } from "@/services/authApi";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  const handleRegister = async (payload) => {
    setLoading(true);
    try {
      const data = await register(payload);
      setUser(data.user);
    } catch (err) {
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (payload) => {
    setLoading(true);
    try {
      const data = await login(payload);
      setUser(data.user);
    } catch (err) {
      console.log("err: ", err);
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
      console.log("err: ", err);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
