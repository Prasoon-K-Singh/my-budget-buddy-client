export const formatCurrency = (amount, currency = "INR", locale = "en-IN") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount / 100);
};
export const rupeesToPaise = (amount) => {
  return Math.round(Number(amount) * 100);
};
export const paiseToRupees = (amount) => {
  return amount / 100;
};
