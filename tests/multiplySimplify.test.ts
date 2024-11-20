import { AlgebraicNode } from "../src/tree/nodes/algebraicNode";
import { OppositeNode } from "../src/tree/nodes/functions/oppositeNode";
import { SqrtNode } from "../src/tree/nodes/functions/sqrtNode";
import { Node } from "../src/tree/nodes/node";
import { NumberNode } from "../src/tree/nodes/numbers/numberNode";
import { AddNode } from "../src/tree/nodes/operators/addNode";
import { FractionNode } from "../src/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "../src/tree/nodes/operators/multiplyNode";
import { VariableNode } from "../src/tree/nodes/variables/variableNode";

const data: { in: AlgebraicNode; out: AlgebraicNode }[] = [
  {
    in: new MultiplyNode(new NumberNode(1), new NumberNode(2)),
    out: new NumberNode(2),
  },
  {
    in: new MultiplyNode(new NumberNode(2), new NumberNode(4)),
    out: new NumberNode(8),
  },
  {
    in: new MultiplyNode(new NumberNode(-2), new NumberNode(4)),
    out: new NumberNode(-8),
  },
];
test("multiplySimplify", () => {
  try {
    for (const d of data) {
      console.log(d.in.toTex());
      const simplified = d.in.simplify();
      console.log(simplified);
      expect(simplified.equals(d.out)).toBe(true);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});
