import { FractionNode } from "../nodes/operators/fractionNode";
import { numberParser } from "./numberParser";

export const rationalParser = (ans: string) => {
  const nb = numberParser(ans);
  if (nb !== false) {
    return nb.toTree();
  }
  if (!ans.includes("\\frac")) return false;

  if (ans.startsWith("\\frac")) {
    const fracs = ans.replaceAll("}", "").split("{").slice(1);
    if (fracs.length !== 2) return false;
    const parsedFracs = fracs.map((e) => numberParser(e));
    if (parsedFracs.some((e) => e === false)) return false;
    const nodeFracs = fracs.map((e) => e.unfrenchify().toTree());
    return new FractionNode(nodeFracs[0], nodeFracs[1]);
  }
  //   if(ans.startsWith("-")){
  //       const fracs = ans.replaceAll("}","").split('{').slice(1)
  //       if(fracs.length !== 2) return false
  //       const parsedFracs = fracs.map((e)=>numberParser(e))
  //       if(parsedFracs.some((e)=>e===false)) return false
  //       return ans;
  //   }
  // const nb = ans.unfrenchify();
  // if (isNaN(nb)) return false;
  // return nb.frenchify();
};
