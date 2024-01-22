export const randomLetter = (
  isMaj: boolean = false,
  excludes: string[] = [],
) => {
  let letter = "";
  do {
    letter = String.fromCharCode(
      (isMaj ? 65 : 97) + Math.floor(Math.random() * 26),
    );
  } while (excludes.includes(letter));
  return letter;
};
