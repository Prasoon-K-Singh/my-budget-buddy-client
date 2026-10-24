import {
  billCreate,
  bills,
  billById,
  billDel,
  billEdit,
  billMarkPaid,
} from "@/services/billApi";
import { useState } from "react";

export const useBill = () => {
  const [billLoading, setLoading] = useState(false);
  const createBill = async (payload) => {
    setLoading(true);
    try {
      const data = await billCreate(payload);
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
  const getBills = async () => {
    setLoading(true);
    try {
      const data = await bills();
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
  const getBillById = async (id) => {
    setLoading(true);
    try {
      const data = await billById(id);
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
  const delBill = async (billId) => {
    setLoading(true);
    try {
      const data = await billDel(billId);
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
  const editBill = async (id, payload) => {
    setLoading(true);
    try {
      const data = await billEdit(id, payload);
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
  const markBillPaid = async (id) => {
    setLoading(true);
    try {
      const data = await billMarkPaid(id);
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
    createBill,
    getBills,
    getBillById,
    delBill,
    editBill,
    markBillPaid,
    billLoading,
  };
};
