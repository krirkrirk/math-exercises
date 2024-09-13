export const toSeperatedThousands = (t: string) => {
  const n = t.unfrenchify();
  if (isNaN(n)) throw Error("NaN passed to toSeperatedThousands");
  const [intPart, fracPart] = t.split(",");
  return (
    intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "\\ ") +
    (fracPart !== undefined ? "," + fracPart : "")
  );
};
