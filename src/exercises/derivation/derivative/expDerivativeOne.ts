import {
  MathExercise,
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
import { Affine } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {
  a: number;
  b: number;
};

const getExpDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const affine = new Polynomial([b, a]);
  const myfunction = new ExpNode(affine.toTree());
  const derivative = new MultiplyNode(new NumberNode(a), myfunction);
  const answer = derivative.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()}$.`,
    startStatement: "f'(x)",
    answer,
    keys: ["x", "epower", "exp"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(a, b);
  const myfunction = new ExpNode(affine.toTree());

  tryToAddWrongProp(propositions, myfunction.toTex());
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affine.toTree(), myfunction).toTex(),
  );
  tryToAddWrongProp(propositions, new ExpNode(new NumberNode(a)).toTex());
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(new NumberNode(b), myfunction).toTex(),
  );
  while (propositions.length < n)
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(new NumberNode(randint(-9, 10)), myfunction).toTex(),
    );

  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<VEAProps> = (ans, { a, b }) => {
  const affine = new Polynomial([b, a]);
  const myfunction = new ExpNode(affine.toTree());
  const derivative = new MultiplyNode(new NumberNode(a), myfunction);
  const texs = derivative.toAllValidTexs();
  return texs.includes(ans);
};
export const expDerivativeOne: MathExercise<QCMProps, VEAProps> = {
  id: "expDerivativeOne",
  connector: "=",
  label: "Dérivée de $\\exp(ax + b)$",
  levels: ["1reESM", "1reSpé", "1reTech", "MathComp", "TermSpé"],
  sections: ["Dérivation", "Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
