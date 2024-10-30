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

type Identifiers = {
  perimeter: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, perimeter },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, (4 * perimeter).frenchify());
  tryToAddWrongProp(propositions, round(perimeter / 2, 3).frenchify());
  const sqrt = new SquareRoot(perimeter).basicSimplify().toTree().toTex();
  tryToAddWrongProp(propositions, sqrt);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 100, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(identifiers.perimeter / 4, 3).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Calculer le côté d'un carré de périmètre $${identifiers.perimeter.frenchify()}$.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Le périmètre d'un carré est égal à $4$ fois la longueur du côté.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return `Le périmètre d'un carré est égal à $4$ fois la longueur du côté. Pour retrouver le côté à partir du périmètre, il faut donc diviser le périmètre par $4$. Le côté du carré est donc égal à : 
  
$$
${new FractionNode(
  identifiers.perimeter.toTree(),
  (4).toTree(),
).toTex()}=${getAnswer(identifiers)}
$$
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, perimeter }) => {
  const node = new FractionNode(perimeter.toTree(), (4).toTree());
  return node.toAllValidTexs({ allowFractionToDecimal: true }).includes(ans);
};

const getSquareSideFromPerimeterQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const identifiers: Identifiers = { perimeter: randfloat(1, 100, 1) };
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

export const squareSideFromPerimeter: Exercise<Identifiers> = {
  id: "squareSideFromPerimeter",
  connector: "=",
  label: "Calculer le côté d'un carré en connaissant son périmètre",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getSquareSideFromPerimeterQuestion, nb),
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
