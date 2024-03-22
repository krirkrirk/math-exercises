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
import { DiscreteSet } from "#root/math/sets/discreteSet";
import { Interval } from "#root/math/sets/intervals/intervals";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { PowerNode, SquareNode } from "#root/tree/nodes/operators/powerNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
};

const getFactoType1Question: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(undefined, {
    excludes: [0],
  });
  const statementTree = affine.multiply(affine).toTree();
  const answerTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Factoriser : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.a, b: affine.b },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new PowerNode(new Affine(b, a).toTree(), new NumberNode(2)).toTex(),
  );
  while (propositions.length < n) {
    const wrongAnswer = new PowerNode(
      new Affine(
        a + randint(-a + 1, 10 - a),
        b + randint(-b + 1, 10 - b),
      ).toTree(),
      new NumberNode(2),
    );
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const affine = new Affine(a, b);
  const answerTree = new SquareNode(affine.toTree());
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const factoIdRmq1: Exercise<Identifiers> = {
  id: "factoIdRmq1",
  connector: "=",
  isSingleStep: false,
  label: "Factorisation du type $a^2 + 2ab + b^2$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
