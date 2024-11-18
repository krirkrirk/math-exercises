import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Line } from "#root/math/geometry/line";
import { Point } from "#root/math/geometry/point";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { alignTex } from "#root/utils/latex/alignTex";
import { randomLetter } from "#root/utils/strings/randomLetter";

type Identifiers = {
  affineA: number;
  affineB: number;
  x: number;
  y: number;
  isOnLine: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return identifiers.isOnLine ? "Oui" : "Non";
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const point = new Point(
    randomLetter(true),
    identifiers.x.toTree(),
    identifiers.y.toTree(),
  );
  const affine = new Affine(identifiers.affineA, identifiers.affineB);
  return `Le point $${point.toTexWithCoords()}$ appartient-il à la droite d'équation $${affine.toReducedEquation()}$ ?`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Remplace $x$ dans l'équation de la droite par l'abscisse du point. Le point appartient à la droite si et seulement si le résultat est égal à l'ordonnée du point.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const affine = new Affine(identifiers.affineA, identifiers.affineB);
  const affineTree = affine.toTree();
  const res = affine.calculate(identifiers.x).toTree().toTex();
  return `On remplace $x$ dans l'équation de la droite par l'abscisse du point : 
  
${alignTex([
  [
    "y",
    "=",
    affineTree.toDetailedEvaluation({ x: identifiers.x.toTree() }).toTex(),
  ],
  ["", "=", res],
])}

${
  identifiers.isOnLine
    ? `On obtient bien l'ordonnée du point. Ainsi, le point appartient bien à la droite.`
    : `On n'obtient pas l'ordonnée du point. Ainsi, le point n'appartient pas à la droite.`
}
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const getIsPointOnLineQuestion: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random();
  const x = randint(-10, 10);
  const isOnLine = coinFlip();
  const yOnLine = affine.calculate(x);
  const y = isOnLine ? yOnLine : yOnLine + randint(-10, 10, [0]);
  const identifiers: Identifiers = {
    x,
    y,
    isOnLine,
    affineA: affine.a,
    affineB: affine.b,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "raw",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const isPointOnLine: Exercise<Identifiers> = {
  id: "isPointOnLine",
  connector: "=",
  label: "Vérifier si un point appartient à une droite d'équation $y=ax+b$",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getIsPointOnLineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  answerType: "QCU",
  hasHintAndCorrection: true,
};
