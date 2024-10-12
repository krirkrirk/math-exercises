export const percentParser = (ans: string, allowNoPercentSign = true) => {
  if (!allowNoPercentSign && !ans.includes("\\%")) return false;
  const nb = ans.replace("\\%", "").unfrenchify();
  if (isNaN(nb)) return false;
  return nb.frenchify() + "\\%";
};
