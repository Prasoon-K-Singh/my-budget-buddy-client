import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export const formatTransactionNo = (transactionNo) => {
  return String(transactionNo).padStart(3, "0");
};
