import { isNumberNode } from "../nodes/numbers/numberNode";
import { isFractionNode } from "../nodes/operators/fractionNode";
import { isPowerNode } from "../nodes/operators/powerNode";
import { parseAlgebraic } from "./latexParser";

export const powerParser = (ans: string) => {
  try {
    const parsed = parseAlgebraic(ans);
    if (!parsed) return false;
    if (isPowerNode(parsed)) return parsed;
    if (
      isFractionNode(parsed) &&
      isNumberNode(parsed.leftChild) &&
      parsed.leftChild.value === 1 &&
      isPowerNode(parsed.rightChild)
    )
      return parsed;
    return false;
  } catch (err) {
    return false;
  }
};
