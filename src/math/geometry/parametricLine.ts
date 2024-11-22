import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { SpacePoint } from "./spacePoint";
import { SpaceVector, SpaceVectorConstructor } from "./spaceVector";

export class ParametricLine {
  startPoint: SpacePoint;
  vector: SpaceVector;
  equations: AlgebraicNode[];
  constructor(startPoint: SpacePoint, vector: SpaceVector) {
    this.startPoint = startPoint;
    this.vector = vector;
    const pointCoords = this.startPoint.getCoords();
    const vectorCoords = this.vector.getCoords();
    this.equations = [0, 1, 2].map((i) =>
      new AddNode(
        pointCoords[i],
        new MultiplyNode(vectorCoords[i], new VariableNode("t")),
      ).simplify({ forbidFactorize: true }),
    );
  }

  toDetailedEvaluation(t: AlgebraicNode) {
    return this.equations.map((e) => e.toDetailedEvaluation({ t: t }));
  }

  getPointCoords(t: AlgebraicNode) {
    return this.toDetailedEvaluation(t).map((e) => e.simplify());
  }
  getPoint(t: AlgebraicNode) {
    const pointCoords = this.toDetailedEvaluation(t).map((e) => e.simplify());
    return new SpacePoint("A", pointCoords[0], pointCoords[1], pointCoords[2]);
  }

  hasPoint(p: SpacePoint) {
    if (p.equals(this.startPoint)) return true;
    const secondPoint = this.vector.getEndPoint(this.startPoint);
    const vector1 = SpaceVectorConstructor.fromPoints(this.startPoint, p);
    const vector2 = SpaceVectorConstructor.fromPoints(
      this.startPoint,
      secondPoint,
    );

    return vector1.isColinear(vector2);
  }

  toTex() {
    return `
\\left\\{\\begin{matrix}
x=${this.equations[0].toTex()} \\\\
y=${this.equations[1].toTex()} \\\\
z=${this.equations[2].toTex()} 
\\end{matrix}
\\right.
`;
  }
}
