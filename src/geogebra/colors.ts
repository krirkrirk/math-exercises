import { random } from "#root/utils/random";

export const red = "#FF3333";
export const pinkDark = "#A10039";
export const pinkMain = "#D83F63";
export const pinkLight = "#FF7390";
export const reds = [red, pinkDark, pinkLight, pinkMain];

export const orangeDark = "#BE5F00";
export const orange = "#F6A118";
export const orangeLight = "#FFBE46";
export const oranges = [orange, orangeDark, orangeLight];

export const greenLight = "#54B1B7";
export const greenMain = "#168187";
export const greenDark = "#00545A";
export const greens = [greenDark, greenLight, greenMain];

export const blueLight = "#769DFF";
export const blueDark = "#0045AB";
export const blueMain = "#376FDE";
export const blueExtraDark = "#00035D";
export const blues = [blueDark, blueExtraDark, blueLight, blueMain];

export const purpleLight = "#BA86FF";
export const purpleMain = "#8657DE";
export const purpleDark = "#522AAB";
export const purples = [purpleDark, purpleLight, purpleMain];
export const colors = [...reds, ...oranges, ...greens, ...blues, ...purples];

export const randomColor = () => {
  return random(colors);
};
