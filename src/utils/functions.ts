export const calculatePriceSubtotal = (
  priceUnit: number,
  quantity: number,
  discount: number
) => {
  const product = quantity * priceUnit;
  return product - product * (discount / 100);
};
