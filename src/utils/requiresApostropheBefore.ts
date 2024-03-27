export const requiresApostropheBefore = (string: string) => {
  return string[0].toLowerCase().match(/[a,e,i,o,u,y,h]/);
};
