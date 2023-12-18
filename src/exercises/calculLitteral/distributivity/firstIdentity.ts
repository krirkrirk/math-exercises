import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { DiscreteSet } from "#root/math/sets/discreteSet";
import { Interval } from "#root/math/sets/intervals/intervals";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {
  a: number;
  b: number;
};
const interval = new Interval("[[1; 10]]").difference(
  new DiscreteSet([new Integer(0)]),
);

export const getFirstIdentityQuestion: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const affine = AffineConstructor.random(interval, interval);

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answer = affine.multiply(affine).toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Développer et réduire : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: ["x"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, a: affine.a, b: affine.b },
  };
  return question;
};

export const getFirstIdentityPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, a, b },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Polynomial([b ** 2, 0, a ** 2]).toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new Polynomial([b ** 2, a * b, a ** 2]).toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new Polynomial([b ** 2, a ** 2 + b ** 2, a ** 2]).toTree().toTex(),
  );

  const affine = new Affine(a, b);
  while (propositions.length < n) {
    const affineTemp = AffineConstructor.random(interval, interval);
    const wrongAnswer = affine.multiply(affineTemp).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

export const isFirstIdentityAnswerValid: VEA<VEAProps> = (ans, { a, b }) => {
  const affine = new Affine(a, b);
  const answer = affine.multiply(affine).toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const firstIdentity: MathExercise<QCMProps, VEAProps> = {
  id: "idRmq1",
  connector: "=",
  label: "Identité remarquable $(a+b)^2$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstIdentityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getFirstIdentityPropositions,
  isAnswerValid: isFirstIdentityAnswerValid,
};
