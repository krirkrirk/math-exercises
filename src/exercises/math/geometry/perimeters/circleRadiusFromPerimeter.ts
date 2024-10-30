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
  perimeter: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, perimeter },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, round(Math.sqrt(perimeter), 2).frenchify());
  tryToAddWrongProp(propositions, round(perimeter / Math.PI, 2).frenchify());
  tryToAddWrongProp(propositions, round(perimeter / 4, 2).frenchify());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 100, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(identifiers.perimeter / (2 * Math.PI), 2).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Calculer le rayon d'un cercle de périmètre $${identifiers.perimeter.frenchify()}$. Arrondir au centième.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Le périmètre d'un cercle est égale à : 
      
  $$
  2\\times \\pi\\times r
  $$
  
  où $r$ est le rayon.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return `Le périmètre d'un cercle est égal à : 
      
  $$
  2\\times \\pi\\times r
  $$
  
  où $r$ est le rayon.
  
  Ici, on a donc : 
  
  $${identifiers.perimeter.frenchify()} = 2\\times \\pi\\times r$
  
  On isole $r$ dans cette équation : 
  
  ${alignTex([
    [
      "r",
      "=",
      new FractionNode(
        identifiers.perimeter.toTree(),
        new MultiplyNode((2).toTree(), PiNode),
      ).toTex(),
    ],
    ["", "\\aprox", getAnswer(identifiers)],
  ])}
  `;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, perimeter }) => {
  const parsed = numberParser(ans);
  if (!parsed) return false;
  return parsed === answer;
};

const getCircleRadiusFromPerimeterQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const perimeter = randfloat(1, 100, 2);
  const identifiers: Identifiers = { perimeter };
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

export const circleRadiusFromPerimeter: Exercise<Identifiers> = {
  id: "circleRadiusFromPerimeter",
  connector: "=",
  label: "Calculer le rayon d'un cercle en connaissant son périmètre",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getCircleRadiusFromPerimeterQuestion, nb),
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
