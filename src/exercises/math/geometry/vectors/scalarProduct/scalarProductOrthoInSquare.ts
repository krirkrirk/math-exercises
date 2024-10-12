import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Point } from "#root/math/geometry/point";
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  c: number;
  vector1Name: string;
  vector2Name: string;
};

const getPoints = (c: number) => {
  const midC = new Rational(c, 2).simplify().toTree();
  const zeroTree = (0).toTree();
  const cTree = c.toTree();
  const points = [
    { name: "A", x: zeroTree, y: zeroTree },
    { name: "I", x: midC, y: zeroTree },
    { name: "B", x: cTree, y: zeroTree },
    { name: "J", x: cTree, y: midC },
    { name: "C", x: cTree, y: cTree },
    { name: "K", x: midC, y: cTree },
    { name: "D", x: zeroTree, y: cTree },
    { name: "L", x: zeroTree, y: midC },
    { name: "O", x: midC, y: midC },
  ];
  return points;
};
const buildFromIdentifiers = (identifiers: Identifiers) => {};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return Math.random() + "";
};

const getInstruction: GetInstruction<Identifiers> = ({
  c,
  vector1Name,
  vector2Name,
}) => {
  return `$ABCD$ est un carré de côté $${c}$ et de centre $O$. Les points $I$,$J$,$K$ et $L$ sont les milieux respectifs des segments $[AB]$, $[BC]$, $[CD]$ et $[AD]$. Calculer : 
  
$$
\\overrightarrow{${vector1Name}}\\cdot \\overrightarrow{${vector2Name}}
$$`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return "";
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return "";
};
const getGGBOptions: GetGGBOptions<Identifiers> = ({ c }) => {
  const points = getPoints(c).map((d) => new Point(d.name, d.x, d.y));
  const ggb = new GeogebraConstructor({
    commands: [
      ...points.flatMap((p) => p.toGGBCommand()),
      `Polygon(A,B,C,D)`,
      `Segment(A,C)`,
      `Segment(B,D)`,
    ],
    hideAxes: true,
    hideGrid: true,
  });
  return ggb.getOptions({
    coords: [-1, c + 1, -1, c + 1],
  });
};
const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const getScalarProductOrthoInSquareQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const c = randint(1, 10);
  // AB AO
  // AB AK
  // AB AJ
  // AB AC
  //ou
  // AI AO
  // AI AK
  // AI AC
  // AI AJ
  //ou
  // AB IJ
  // AB OC
  // AB LK
  // AB OJ
  // AB LO
  //ou
  // AI IJ
  // AI OC
  // AI LK
  // AI OJ
  // AI LO
  // puis on shuffle dans tous les sens
  const firstPointIndex = random([0, 2, 4, 6]); //A,B,C,D
  const isD = firstPointIndex === 6;
  const delta = isD ? 3 : 2;
  const secondPointIndex = random([
    (firstPointIndex + delta) % 8,
    (firstPointIndex + 1) % 8,
  ]); //si first=A alors B ou I, idem par translation pour les autres
  const thirdPointIndex = random([(1 + delta) % 8, (7 + delta * 8) % 8, 8]);
  const identifiers: Identifiers = { c, vector1Name: "BC", vector2Name: "AC" };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
    ggbOptions: getGGBOptions(identifiers),
  };

  return question;
};

export const scalarProductOrthoInSquare: Exercise<Identifiers> = {
  id: "scalarProductOrthoInSquare",
  connector: "=",
  label: "Produit scalaire par projeté orthogonal (dans un carré)",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getScalarProductOrthoInSquareQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  getGGBOptions,
};
