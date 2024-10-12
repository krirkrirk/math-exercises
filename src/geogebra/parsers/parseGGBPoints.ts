import { deleteObjectNamesFromAnswer } from "../deleteObjectNamesFromAnswer";

export const parseGGBPoints = (commands: string[]) => {
  const unnamed = deleteObjectNamesFromAnswer(commands);
  const re = /\([^,]*,[^)]*\)/;
  return unnamed.filter((cmd) => !!cmd.match(re)?.length);
};
