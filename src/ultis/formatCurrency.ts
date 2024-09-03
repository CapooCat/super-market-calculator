const formatCurrency = (amount: number) => {
  try {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } catch {
    const zero = 0;
    return zero.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }
};

export default formatCurrency;
