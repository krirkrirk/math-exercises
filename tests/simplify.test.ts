import { AlgebraicNode } from "../src/tree/nodes/algebraicNode";
import { Node } from "../src/tree/nodes/node";
import { NumberNode } from "../src/tree/nodes/numbers/numberNode";
import { AddNode } from "../src/tree/nodes/operators/addNode";

const data: { in: AlgebraicNode; out: AlgebraicNode }[] = [
  {
    in: new AddNode(new NumberNode(1), new NumberNode(2)),
    out: new NumberNode(3),
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
