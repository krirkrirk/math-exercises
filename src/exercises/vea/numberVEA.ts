import { numberParser } from "#root/tree/parsers/numberParser";

export const numberVEA = (studentAns: string, answer: string) => {
  const parsed = numberParser(studentAns);
  if (!parsed) return false;
  return parsed === answer;
};
