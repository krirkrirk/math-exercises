import {
  Exercise,
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

type Identifiers = {
  a: number;
  b: number;
};

export const getSecondIdentityQuestion: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(
    {
      min: 1,
      max: 11,
    },
    {
      min: -10,
      max: 0,
    },
  );

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answer = affine.multiply(affine).toTree().toTex();

  const question: Question<Identifiers> = {
    instruction: `Développer et réduire : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.a, b: affine.b },
  };
  return question;
};

export const getSecondIdentityPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    new Polynomial([-(b ** 2), 0, a ** 2]).toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new Polynomial([b ** 2, a * b, a ** 2]).toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new Polynomial([-(b ** 2), -(a ** 2 + b ** 2), a ** 2]).toTree().toTex(),
  );

  const affine = new Affine(a, b);
  while (propositions.length < n) {
    const affineTemp = AffineConstructor.random(
      {
        min: 1,
        max: 11,
      },
      {
        min: -10,
        max: 0,
      },
    );
    const wrongAnswer = affine.multiply(affineTemp).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

export const isSecondIdentityAnswerValid: VEA<Identifiers> = (
  ans,
  { a, b },
) => {
  const affine = new Affine(a, b);
  const answer = affine.multiply(affine).toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const secondIdentity: Exercise<Identifiers> = {
  id: "idRmq2",
  connector: "=",
  label: "Identité remarquable $(a-b)^2$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getSecondIdentityQuestion, nb),
  getPropositions: getSecondIdentityPropositions,
  isAnswerValid: isSecondIdentityAnswerValid,
  qcmTimer: 60,
  freeTimer: 60,
  subject: "Mathématiques",
};
