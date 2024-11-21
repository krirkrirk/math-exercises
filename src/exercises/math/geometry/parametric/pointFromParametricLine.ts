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
import { ParametricLine } from "#root/math/geometry/parametricLine";
import { Point, PointConstructor } from "#root/math/geometry/point";
import {
  SpacePoint,
  SpacePointConstructor,
} from "#root/math/geometry/spacePoint";
import { SpaceVectorConstructor } from "#root/math/geometry/spaceVector";
import { System } from "#root/math/systems/system";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { randomLetter } from "#root/utils/strings/randomLetter";

type Identifiers = {
  startPoint: number[];
  vector: number[];
  askedPointCoords: number[];
  askedPointName: string;
  isOnLine: boolean;
  coeff?: number;
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
  const point = SpacePointConstructor.fromScalars(
    identifiers.askedPointCoords,
    identifiers.askedPointName,
  );
  const line = new ParametricLine(
    point,
    SpaceVectorConstructor.fromScalars(identifiers.vector),
  );

  return `Soit $d$ la droite d'équation paramétrique : 
  
$$
${line.toTex()}
$$

où $t\\in \\mathbb{R}$. 

Le point $${point.toTexWithCoords()}$ appartient-il à $d$ ?
  `;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const getPointFromParametricLineQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const startPoint = SpacePointConstructor.random("A");
  const vector = SpaceVectorConstructor.random("B");
  const isOnLine = coinFlip();
  const askedPointName = randomLetter(true, ["O"]);

  let askedPoint;
  let coeff;
  if (isOnLine) {
    coeff = randint(-10, 10);
    const res = vector.times(coeff.toTree());
    askedPoint = res.getEndPoint(startPoint);
  } else {
    askedPoint = SpacePointConstructor.random(askedPointName);
  }
  // const askedPoint = SpacePointConstructor.random(askedPointName);
  const identifiers: Identifiers = {
    startPoint: startPoint.getEvaluatedCoords(),
    vector: vector.getEvaluatedCoords(),
    askedPointCoords: askedPoint.getEvaluatedCoords(),
    askedPointName,
    isOnLine,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

export const pointFromParametricLine: Exercise<Identifiers> = {
  id: "pointFromParametricLine",
  connector: "=",
  label:
    "Vérifier si un point appartient à une droite d'équation paramétrique donnée",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getPointFromParametricLineQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  getKeys,
  answerType: "QCU",
};
