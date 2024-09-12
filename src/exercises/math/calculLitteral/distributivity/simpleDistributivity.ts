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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { alignTex } from "#root/utils/alignTex";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
  coeff: number;
};

const getSimpleDistributivityQuestion: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(undefined, {
    excludes: [0],
  });
  const coeff = randint(-10, 11, [-1, 0, 1]);

  const statementTree = new MultiplyNode(
    new NumberNode(coeff),
    affine.toTree(),
  );
  const answer = affine.times(coeff).toTree().toTex();
  const statementTex = statementTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Développer et réduire : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.a, b: affine.b, coeff: coeff },
    hint: `Multiplie chaque terme dans la parenthèse par $${coeff}$.`,
    correction: `
${alignTex([
  [
    statementTex,
    "=",
    new AddNode(
      new MultiplyNode(
        new NumberNode(coeff),
        new MultiplyNode(new NumberNode(affine.a), "x".toTree()),
      ),
      new MultiplyNode(new NumberNode(coeff), new NumberNode(affine.b)),
    ).toTex(),
  ],
  ["", "=", answer],
])}
    `,
  };
  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, coeff },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(a, b);
  tryToAddWrongProp(propositions, new Affine(coeff * a, b).toTree().toTex());
  tryToAddWrongProp(propositions, new Affine(a, coeff * b).toTree().toTex());
  tryToAddWrongProp(propositions, affine.times(-coeff).toTree().toTex());

  while (propositions.length < n) {
    const wrongAnswer = AffineConstructor.random(undefined, {
      excludes: [0],
    }).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { a, b, coeff }) => {
  const affine = new Affine(a, b);
  const answerTree = affine.times(coeff).toTree();
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const simpleDistributivity: Exercise<Identifiers> = {
  id: "simpleDistri",
  connector: "=",
  label: "Distributivité simple",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1reTech"],
  sections: ["Calcul littéral"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getSimpleDistributivityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
