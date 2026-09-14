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
export const shortAmount = (amount) => {
  amount = amount / 100;
  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(2)}B`;
  }

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(2)}M`;
  }

  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(2)}K`;
  }

  return Number(amount).toFixed(2).replace(/\.00$/, "");
};
