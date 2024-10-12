export const euroParser = (ans: string, allowNoEuroSign = true) => {
  if (!allowNoEuroSign && !ans.includes("€")) return false;
  const nb = ans.replace("€", "").unfrenchify();
  if (isNaN(nb)) return false;
  return nb.frenchify() + "€";
};
