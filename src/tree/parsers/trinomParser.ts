import { Affine } from "#root/math/polynomials/affine";
import { Node } from "../nodes/node";
import { isNumberNode } from "../nodes/numbers/numberNode";
import { isAddNode } from "../nodes/operators/addNode";
import { isMultiplyNode } from "../nodes/operators/multiplyNode";
import { isSubstractNode } from "../nodes/operators/substractNode";
import { isVariableNode } from "../nodes/variables/variableNode";
import { parseAlgebraic } from "./latexParser";
import { isMonomNode, monomParser } from "./monomParser";

export const trinomParser = (ans: string, variable: string = "x") => {
  try {
    //! difficile !
    //! peut etre que je fais fausse, il faut peut etre simplifier canoniquement et checker si ca ressemble à un trinome
    //! mais ce qui m'embete dans cette approche c'est que la simplification va etre trop "gentille", on va accepter des trucs qu'on aurait pas du ...
    // const monom = monomParser(ans, { variable, maxDegree: 2, minDegree: 2 });
    // if (monom) return monom;
    // const parsed = parseAlgebraic(ans);
    // if (isAddNode(parsed) || isSubstractNode(parsed)) {
    //   const numericChild = parsed.leftChild.isNumeric
    //     ? "left"
    //     : parsed.rightChild.isNumeric
    //     ? "right"
    //     : undefined;
    // //si numeric : alors ax^2 + b ou ax+b
    // //sinon : ax^2 + bx + c car monom déjà exclu
    //   if (!numericChild) return false;
    //   const varChild =
    //     numericChild === "left" ? parsed.rightChild : parsed.leftChild;
    //   return isMonomNode(varChild, { variable, maxDegree: 1 }) ? parsed : false;
    // }
    // return false;
  } catch (err) {
    return false;
  }
};
