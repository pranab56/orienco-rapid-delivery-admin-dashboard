export const CURRENCY_MAP = {
  XOF: { symbol: "CFA ", name: "CFA Franc" },
  USD: { symbol: "$", name: "United States Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  ETB: { symbol: "ETB ", name: "Ethiopian Birr" },
};

export function getCurrencySymbol(code) {
  return (CURRENCY_MAP[code] || CURRENCY_MAP.USD).symbol;
}

export function formatCurrency(amount, currencyCode = "USD") {
  const symbol = getCurrencySymbol(currencyCode);
  const num = typeof amount === "number" ? amount : parseFloat(amount) || 0;
  return `${symbol}${num.toFixed(2)}`;
}
