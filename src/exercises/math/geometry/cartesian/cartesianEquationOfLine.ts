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
    `d = Line((${a.getXnumber()},${a.getYnumber()}),(${b.getXnumber()},${b.getYnumber()}))`,
    `SetCaption(d, "$d$")`,
    `ShowLabel(d,true)`,
    `SetFixed(d,true)`,
  ];

  const ggb = new GeogebraConstructor(commands, { isGridSimple: true });
  const correctAnswer = line.getCartesianEquation();

  const instruction = `Déterminer l'equation cartesienne de la droite $d$`;

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
    instruction: instruction,
    keys: ["x", "y", "equal"],
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
  if (userAns.evaluate({ x: aX, y: aY }) !== 0) return false;
  if (userAns.evaluate({ x: bX, y: bY }) !== 0) return false;
  return true;
};

const getEquationNodeFromString = (ans: string): AlgebraicNode | undefined => {
  if (!isValidFormat(ans)) return undefined;
  const splitted = ans.split("=");
  const leftSide = splitted[0];
  const op =
    leftSide.charAt(0) === "-" ? leftSide.replace("-", "minus") : leftSide;
  if (op.includes("+")) {
    return getNodeFromString(op.split("+"), "+");
  }
  return getNodeFromString(op.split("-"), "-");
};

const isValidFormat = (ans: string) => {
  if (!ans.includes("=")) return false;
  const splitted = ans.split("=");
  if (splitted.length !== 2 || splitted[1] !== "0") return false;
  return true;
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
  } else if (str.length === 2) {
    const op1 = findOpInSimpleOpString(str[0]);
    const op2 = findOpInSimpleOpString(str[1]);
    const leftSide = op1 !== "" ? str[0].split(op1) : [str[0]];
    const rightSide = op2 !== "" ? str[1].split(op2) : [str[1]];
    const var1 = getNodeFromString(leftSide, op1);
    const var2 = getNodeFromString(rightSide, op2);
    return op === "+"
      ? new AddNode(var1, var2).simplify()
      : new SubstractNode(var1, var2).simplify();
  } else {
    const leftSide = getNodeFromString([str[0], str[1]], op);
    const rightSide = getNodeFromString([str[2]], op);
    return op === "+"
      ? new AddNode(leftSide, rightSide)
      : new SubstractNode(leftSide, rightSide);
  }
};

const findOpInSimpleOpString = (str: string): string => {
  if (str.includes("-")) return "-";
  if (str.includes("+")) return "+";
  return "";
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
  label: "Déterminer une equation cartesienne de droite",
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
