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
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { numberParser } from "#root/tree/parsers/numberParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  area: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, area }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, round(Math.sqrt(area), 2).frenchify());
  tryToAddWrongProp(propositions, round(area / Math.PI, 2).frenchify());
  tryToAddWrongProp(propositions, round(area / (2 * Math.PI), 2).frenchify());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 100, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(Math.sqrt(identifiers.area / Math.PI), 2).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Calculer le rayon d'un cercle d'aire $${identifiers.area.frenchify()}$. Arrondir au centième.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `L'aire d'un cercle est égale à : 
    
$$
\\pi\\times r^2
$$

où $r$ est le rayon.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const r2 = identifiers.area / Math.PI;
  return `L'aire d'un cercle est égale à : 
    
$$
\\pi\\times r^2
$$

où $r$ est le rayon.

Ici, on a donc : 

$$
${identifiers.area.frenchify()} =  \\pi\\times r^2
$$

On isole $r^2$ dans cette équation : 

${alignTex([
  ["r^2", "=", new FractionNode(identifiers.area.toTree(), PiNode).toTex()],
  ["", "\\approx", round(r2, 2).frenchify()],
])}

Enfin, on obtient $r$ en prenant la racine carrée du résultat précédent : 

${alignTex([
  ["r", "=", new SqrtNode(round(r2, 2).toTree()).toTex()],
  ["", "\\approx", getAnswer(identifiers)],
])}
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, area }) => {
  const parsed = numberParser(ans);
  if (!parsed) return false;
  return parsed === answer;
};

const getCircleRadiusFromAreaQuestion: QuestionGenerator<Identifiers> = () => {
  const area = randfloat(1, 100, 2);
  const identifiers: Identifiers = { area };
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

export const circleRadiusFromArea: Exercise<Identifiers> = {
  id: "circleRadiusFromArea",
  connector: "=",
  label: "Calculer le rayon d'un cercle en connaissant son aire",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getCircleRadiusFromAreaQuestion, nb),
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
