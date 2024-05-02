import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Line } from "#root/math/geometry/line";
import { Point, PointConstructor } from "#root/math/geometry/point";
import { Vector } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  aX: number;
  aY: number;
  bX: number;
  bY: number;
};

const getCartesianEquationOfLineQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = new Point(
    "A",
    new NumberNode(randint(-5, 6)),
    new NumberNode(randint(-5, 6)),
  );
  const b = new Point(
    "B",
    new NumberNode(randint(-5, 6, [a.getXnumber()])),
    new NumberNode(randint(-5, 6, [a.getXnumber()])),
  );
  const line = new Line(a, b);

  const commands = [
    `Line((${a.getXnumber()},${a.getYnumber()}),(${b.getXnumber()},${b.getYnumber()}))`,
  ];

  const ggb = new GeogebraConstructor(commands, { isGridSimple: true });
  const correctAnswer = line.getCartesianEquation();

  const aX = a.getXnumber();
  const aY = a.getYnumber();
  const bX = b.getXnumber();
  const bY = b.getYnumber();
  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: ggb.getAdaptedCoords({
      xMin: Math.min(aX, bX) - 5,
      xMax: Math.max(bX, aX) + 5,
      yMin: Math.min(aY, bY) - 5,
      yMax: Math.max(bY, aY) + 5,
    }),
    instruction: ``,
    keys: [],
    answerFormat: "tex",
    identifiers: { aX, aY, bX, bY },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, aX, aY, bX, bY },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(aX, aY, bX, bY).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  let aXrand;
  let aYrand;
  while (propositions.length < n) {
    aXrand = randint(-10, 11, [aX]);
    aYrand = randint(-10, 11, [aY]);
    tryToAddWrongProp(
      propositions,
      getCorrectAnswer(aXrand, aYrand, bX, bY).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getCorrectAnswer = (aX: number, aY: number, bX: number, bY: number) => {
  const a = new Point("A", new NumberNode(aX), new NumberNode(aY));
  const b = new Point("B", new NumberNode(bX), new NumberNode(bY));
  const line = new Line(a, b);
  return line.getCartesianEquation();
};

const generateProposition = (
  aX: number,
  aY: number,
  bX: number,
  bY: number,
): EqualNode[] => {
  const x = new VariableNode("x");
  const y = new VariableNode("y");
  const firstProposition = getFirstProposition(x, y, aX, aY, bX, bY);
  const secondProposition = getSecondPropoition(x, y, aX, aY, bX, bY);
  return [firstProposition, secondProposition];
};

const getFirstProposition = (
  x: VariableNode,
  y: VariableNode,
  aX: number,
  aY: number,
  bX: number,
  bY: number,
) => {
  const u = new Vector("u", new NumberNode(bX - aX), new NumberNode(bY - aY));
  const b = u.getXAsNumber();
  const a = -u.getYAsNumber();
  const c = -a * aX - b * aY;
  return new EqualNode(
    new AddNode(
      new AddNode(
        new MultiplyNode(new NumberNode(a), x).simplify(),
        new MultiplyNode(new NumberNode(b), y).simplify(),
      ),
      new NumberNode(c),
    ),
    new NumberNode(0),
  );
};

const getSecondPropoition = (
  x: VariableNode,
  y: VariableNode,
  aX: number,
  aY: number,
  bX: number,
  bY: number,
) => {
  const u = new Vector("u", new NumberNode(aX - bX), new NumberNode(aY - bY));
  const b = -u.getXAsNumber();
  const a = u.getYAsNumber();
  const c = a * aX + b * aY;
  return new EqualNode(
    new AddNode(
      new AddNode(
        new MultiplyNode(new NumberNode(a), x).simplify(),
        new MultiplyNode(new NumberNode(b), y).simplify(),
      ),
      new NumberNode(c),
    ),
    new NumberNode(0),
  );
};

const isAnswerValid: VEA<Identifiers> = (ans, { aX, aY, bX, bY }) => {
  let userAns = getEquationNodeFromString(ans);
  if (userAns === undefined) return false;
  userAns = userAns as AlgebraicNode;
  const correctAnswer = getEquation(aX, aY, bX, bY);

  return (
    correctAnswer.evaluate({ x: aX, y: aY }) +
      correctAnswer.evaluate({ x: bX, y: bY }) ===
    userAns.evaluate({ x: aX, y: aY }) + userAns.evaluate({ x: bX, y: bY })
  );
};
const getEquation = (
  aX: number,
  aY: number,
  bX: number,
  bY: number,
): AlgebraicNode => {
  const u = new Vector("u", new NumberNode(bX - aX), new NumberNode(bY - aY));
  const b = -u.getXAsNumber();
  const a = u.getYAsNumber();
  const c = -a * aX - b * aY;
  const x = new VariableNode("x");
  const y = new VariableNode("y");
  return new AddNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), x).simplify(),
      new MultiplyNode(new NumberNode(b), y).simplify(),
    ),
    new NumberNode(c),
  ).simplify({ forbidFactorize: true });
};

const getEquationNodeFromString = (ans: string): AlgebraicNode | undefined => {
  if (!ans.includes("=")) return undefined;
  const rightSide = ans.split("=")[0];
  let op;
  if (rightSide.charAt(0) === "-") {
    op = rightSide.replace("-", "minus").split("+");
  } else {
    op = rightSide.split("+");
  }
  if (op.length === 3) {
    const var1 = getNodeFromVariableString(op[0].replace("minus", "-"), "x");
    const var2 = getNodeFromVariableString(op[1], "y");
    return new AddNode(
      new AddNode(var1, var2).simplify(),
      new NumberNode(+op[2]),
    );
  }
  if (op.length === 1) {
    op = op[0].split("-");
    const var1 = getNodeFromVariableString(op[0].replace("minus", "-"), "x");
    const var2 = getNodeFromVariableString(op[1], "y");
    return new SubstractNode(
      new SubstractNode(var1, var2).simplify(),
      new NumberNode(+op[2]),
    );
  }
  return getNodeFromString(op, "+");
};

const getNodeFromString = (str: string[], op: string): AlgebraicNode => {
  if (str.length === 1) {
    const varStr = str[0];
    if (varStr.includes("x")) {
      return getNodeFromVariableString(varStr.replace("minus", "-"), "x");
    }
    if (varStr.includes("y")) {
      return getNodeFromVariableString(varStr.replace("minus", "-"), "y");
    }

    return isNaN(+varStr) ? new NumberNode(0) : new NumberNode(+varStr);
  } else {
    if (str[0].includes("-")) {
      return new AddNode(
        getNodeFromString(str[0].split("-"), "-"),
        getNodeFromString([str[1]], "-"),
      ).simplify();
    }
    if (str[1].includes("-")) {
      return new AddNode(
        getNodeFromString([str[0]], "-"),
        getNodeFromString(str[1].split("-"), "-"),
      ).simplify();
    }
    if (str[0].includes("+")) {
      return new AddNode(
        getNodeFromString(str[0].split("+"), "+"),
        getNodeFromString([str[1]], "+"),
      ).simplify();
    }
    if (str[1].includes("+")) {
      return new AddNode(
        getNodeFromString([str[0]], "+"),
        getNodeFromString(str[1].split("+"), "+"),
      ).simplify();
    }
    const var1 = getNodeFromString([str[0]], op);
    const var2 = getNodeFromString([str[1]], op);
    return op === "+"
      ? new AddNode(var1, var2).simplify()
      : new SubstractNode(var1, var2).simplify();
  }
};

const getNodeFromVariableString = (
  str: string,
  splitter: string,
): AlgebraicNode => {
  if (str === splitter) return new VariableNode(splitter);
  const splitted = str.split(splitter);
  if (splitted[0] === "-") {
    return new MultiplyNode(
      new NumberNode(-1),
      new VariableNode(splitter),
    ).simplify();
  }
  return new MultiplyNode(
    new NumberNode(+splitted[0]),
    new VariableNode(splitter),
  ).simplify();
};

export const cartesianEquationOfLine: Exercise<Identifiers> = {
  id: "cartesianEquationOfLine",
  label: "Test",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Droites"],
  generator: (nb: number) =>
    getDistinctQuestions(getCartesianEquationOfLineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
