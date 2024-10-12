/**
 *
 * @param e
 * @returns
 * ! probably doesn't work if enum contains numbers
 */
export const enumToArray = (e: any) => {
  const colors = Object.keys(e).filter((item) => {
    return isNaN(Number(item));
  });
  return colors.join('\n');
};
