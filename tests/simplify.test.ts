import { AlgebraicNode } from "../src/tree/nodes/algebraicNode";
import { OppositeNode } from "../src/tree/nodes/functions/oppositeNode";
import { Node } from "../src/tree/nodes/node";
import { NumberNode } from "../src/tree/nodes/numbers/numberNode";
import { AddNode } from "../src/tree/nodes/operators/addNode";
import { FractionNode } from "../src/tree/nodes/operators/fractionNode";

const data: { in: AlgebraicNode; out: AlgebraicNode }[] = [
  {
    in: new AddNode(new NumberNode(1), new NumberNode(2)),
    out: new NumberNode(3),
  },
  {
    in: new FractionNode(new NumberNode(2), new NumberNode(4)),
    out: new FractionNode(new NumberNode(1), new NumberNode(2)),
  },
  {
    in: new FractionNode(new NumberNode(-2), new NumberNode(4)),
    out: new OppositeNode(
      new FractionNode(new NumberNode(1), new NumberNode(2)),
    ),
  },
];
test("simplify", () => {
  try {
    for (const d of data) {
      expect(d.in.simplify().equals(d.out)).toBe(true);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});
