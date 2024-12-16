import { isNumberNode } from "#root/tree/nodes/numbers/numberNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { rationalParser } from "#root/tree/parsers/rationalParser";

//return true if studentAns is a number or rational, and if it evaluates to answer
type Opts = {
  allowNonIrreductible?: boolean;
  allowDecimal?: boolean;
  decimalPrecision?: number; // undefined : accepts only allowed values, else : unités / dixieme / centaines / ...
};
export const rationalVEA = (
  studentAns: string,
  answer: string,
  { allowNonIrreductible, decimalPrecision, allowDecimal }: Opts = {
    allowNonIrreductible: true,
    decimalPrecision: undefined,
    allowDecimal: true,
  },
) => {
  allowDecimal = allowDecimal ?? true;
  allowNonIrreductible = allowNonIrreductible ?? true;
  decimalPrecision = decimalPrecision ?? undefined;
  const parsed = rationalParser(studentAns);
  if (!parsed) return false;
  try {
    const parsedAnswer = parseAlgebraic(answer);

    if (isNumberNode(parsed)) {
      if (!allowDecimal) return false;
      if (decimalPrecision === undefined)
        return (
          Math.abs(parsed.evaluate() - parsedAnswer.evaluate()) < 0.0000001
        );
      else {
        //! accepte bien les arrondis au centième par ex, mais va aussi accepter les arrondis au millième
        //! je juge ca ok
        return (
          Math.abs(parsed.evaluate() - parsedAnswer.evaluate()) <
          Math.pow(10, -decimalPrecision - 1)
        );
      }
    } else if (allowNonIrreductible) {
      return Math.abs(parsed.evaluate() - parsedAnswer.evaluate()) < 0.0000001;
    } else {
      //parsed est une fraction ou opposite(frac)
      return parsed.equals(parsedAnswer);
    }
  } catch (err) {
    return false;
  }
};
