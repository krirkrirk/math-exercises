import { Affine, AffineConstructor } from "./math/polynomials/affine";
import { AddNode } from "./tree/nodes/operators/addNode";
import { MultiplyNode } from "./tree/nodes/operators/multiplyNode";
import { random } from "./utils/random";
import { shuffle } from "./utils/shuffle";

export const playground = () => {
  const affines = AffineConstructor.differentRandoms(3);

  const permut: Affine[][] = [
    shuffle([affines[0], affines[1]]),
    shuffle([affines[0], affines[2]]),
  ];

  const operation = random(["add", "substract"]);

  const statementTree = new AddNode(
    new MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()),
    new MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree()),
  );

  console.log(statementTree.simplify().toTex());
};
