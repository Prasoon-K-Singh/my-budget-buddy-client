import { getDashboardOverview } from "@/services/dashboardApi";
import { useState } from "react";

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const handleGetDashboardOverview = async () => {
    setLoading(true);
    try {
      const data = await getDashboardOverview();
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

  return {
    handleGetDashboardOverview,
    loading,
  };
};
