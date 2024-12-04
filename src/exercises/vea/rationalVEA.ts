import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { rationalParser } from "#root/tree/parsers/rationalParser";

//return true if studentAns is a number or rational, and if it evaluates to answer
export const rationalVEA = (studentAns: string, answer: string) => {
  const parsed = rationalParser(studentAns);
  if (!parsed) return false;
  const parsedAnswer = parseAlgebraic(answer);
  return Math.abs(parsed.evaluate() - parsedAnswer.evaluate()) < 0.0000001;
};
