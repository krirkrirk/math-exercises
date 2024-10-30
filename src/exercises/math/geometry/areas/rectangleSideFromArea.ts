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
import { round } from "#root/math/utils/round";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { numberParser } from "#root/tree/parsers/numberParser";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  area: number;
  width: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, area, width },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, round(area / 4, 3).frenchify());
  tryToAddWrongProp(propositions, round(area - width, 3).frenchify());
  tryToAddWrongProp(propositions, round((area - 2 * width) / 2, 3).frenchify());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 100, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(identifiers.area / identifiers.width, 2).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Calculer la longueur d'un rectangle d'aire $${identifiers.area.frenchify()}$ et de largeur $${identifiers.width.frenchify()}$.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `L'aire d'un rectangle est le produit de la largeur et de la longueur.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return `L'aire d'un rectangle est le produit de la largeur et de la longueur.
  
Ici, on a donc : 
  
$$
${identifiers.area.frenchify()} = ${identifiers.width.frenchify()}\\times L
$$
    
Pour retrouver la longueur, on isole $L$ dans cette équation. On obtient : 
  
${alignTex([
  [
    "L",
    "=",
    `${new FractionNode(
      identifiers.area.toTree(),
      identifiers.width.toTree(),
    ).toTex()}`,
  ],
  ["", "=", getAnswer(identifiers)],
])}
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, area, width }) => {
  const parsed = numberParser(ans);
  if (!parsed) return false;
  return parsed === answer;
};

const getRectangleSideFromAreaQuestion: QuestionGenerator<Identifiers> = () => {
  const width = randfloat(1, 50, 1);
  const length = randfloat(width + 1, width + 30, 1);
  const area = round(width * length, 5);
  const identifiers: Identifiers = {
    area,
    width,
  };
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

export const rectangleSideFromArea: Exercise<Identifiers> = {
  id: "rectangleSideFromArea",
  connector: "=",
  label:
    "Calculer la longueur d'un rectangle en connaissant son aire et sa largeur",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getRectangleSideFromAreaQuestion, nb),
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
