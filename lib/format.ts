/** Sri Lankan rupees with the "Rs." mark, e.g. Rs. 1,000.00 */
export function formatLKR(amount: number): string {
  const formatted = new Intl.NumberFormat("en-LK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  return `Rs. ${formatted}`;
}

export const formatRs = formatLKR;
