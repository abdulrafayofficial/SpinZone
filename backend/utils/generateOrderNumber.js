export const generateOrderNumber = () => {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `SZ-${Date.now()}-${suffix}`;
};
