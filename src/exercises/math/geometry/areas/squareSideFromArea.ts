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
import { SquareRoot } from "#root/math/numbers/reals/real";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  area: number;
  isPerfectSquare: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, area }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, (area * area).frenchify());
  tryToAddWrongProp(propositions, round(area / 2, 2).frenchify());
  tryToAddWrongProp(propositions, round(area / 4, 2).frenchify());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 100, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(Math.sqrt(identifiers.area), 2).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Calculer le côté d'un carré d'aire $${identifiers.area.frenchify()}$. Arrondir au centième.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `L'aire d'un carré est égale au carré du côté.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return `L'aire d'un carré est égale au carré du côté. Pour retrouver le côté à partir de l'aire, il faut donc calculer la racine carrée de l'aire. Le côté du carré est donc égal à : 
    
$$
${new SqrtNode(identifiers.area.toTree()).toTex()}${
    identifiers.isPerfectSquare ? "=" : "\\approx"
  }${getAnswer(identifiers)}
$$
  `;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, area }) => {
  const node = new SqrtNode(area.toTree());
  const approximation = round(Math.sqrt(area), 2).frenchify();
  return [...node.toAllValidTexs(), approximation].includes(ans);
};

const getSquareSideFromAreaQuestion: QuestionGenerator<Identifiers> = () => {
  const isPerfectSquare = coinFlip();
  const area = isPerfectSquare ? randint(1, 11) ** 2 : randfloat(1, 100, 1);
  const identifiers: Identifiers = { area, isPerfectSquare };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const squareSideFromArea: Exercise<Identifiers> = {
  id: "squareSideFromArea",
  connector: "=",
  label: "Calculer le côté d'un carré en connaissant son aire",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getSquareSideFromAreaQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
