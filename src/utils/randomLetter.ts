export const randomLetter = (isMaj: boolean = false) => {
  if (isMaj) return String.fromCharCode(65 + Math.floor(Math.random() * 26));

  return String.fromCharCode(97 + Math.floor(Math.random() * 26));
};
