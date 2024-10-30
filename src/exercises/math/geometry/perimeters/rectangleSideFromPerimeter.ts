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
import { randfloat } from "#root/math/utils/random/randfloat";
import { round } from "#root/math/utils/round";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  perimeter: number;
  width: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, perimeter, width },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, round(perimeter / 4, 2).frenchify());
  tryToAddWrongProp(propositions, round(perimeter - width, 2).frenchify());
  tryToAddWrongProp(propositions, round(perimeter - 2 * width, 2).frenchify());

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 100, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(
    (identifiers.perimeter - 2 * identifiers.width) / 2,
    2,
  ).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Calculer la longueur d'un rectangle de périmètre $${identifiers.perimeter.frenchify()}$ et de largeur $${identifiers.width.frenchify()}$.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Le périmètre d'un rectangle est égal à :

$$
P = 2\\times l + 2\\times L
$$

où $l$ et la largeur et $L$ et la longueur.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const lengthDouble = round(identifiers.perimeter - 2 * identifiers.width, 3);

  return `Le périmètre d'un rectangle est égal à :

$$
P = 2\\times l + 2\\times L
$$

Ici, on a donc : 

$$
${identifiers.perimeter.frenchify()} = 2\\times ${identifiers.width.frenchify()} + 2\\times L
$$
    
Pour retrouver la longueur, on isole $L$ dans cette équation. On obtient : 

${alignTex([
  [
    "2\\times L",
    "=",
    `${identifiers.perimeter.frenchify()}- 2\\times ${identifiers.width.frenchify()}`,
  ],
  ["", "=", `${lengthDouble.frenchify()}`],
])}

Ainsi, la longueur du rectangle vaut : 

${alignTex([
  [
    "L",
    "=",
    `${new FractionNode(lengthDouble.toTree(), (2).toTree()).toTex()}`,
  ],
  ["", "=", getAnswer(identifiers)],
])}
  `;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, perimeter, width }) => {
  const node = new FractionNode((perimeter - 2 * width).toTree(), (2).toTree());
  return node.toAllValidTexs({ allowFractionToDecimal: true }).includes(ans);
};

const getRectangleSideFromPerimeterQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const width = randfloat(1, 50, 1);
  const perimeter = randfloat(2 * width + 2, 2 * width + 50, 1);
  const length = round((perimeter - 2 * width) / 2, 2);
  const identifiers: Identifiers = {
    perimeter,
    width: Math.min(width, length),
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

export const rectangleSideFromPerimeter: Exercise<Identifiers> = {
  id: "rectangleSideFromPerimeter",
  connector: "=",
  label:
    "Calculer la longueur d'un rectangle en connaissant son périmètre et sa largeur",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getRectangleSideFromPerimeterQuestion, nb),
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
