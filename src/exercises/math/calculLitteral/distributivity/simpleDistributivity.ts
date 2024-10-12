import {
  Exercise,
  GetAnswer,
  GetCorrection,
  GetHint,
  GetInstruction,
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
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  a: number;
  b: number;
  coeff: number;
};

const buildStatement = (identifiers: Identifiers) => {
  const { a, b, coeff } = identifiers;
  const affine = new Affine(a, b);
  const statementTree = new MultiplyNode(
    new NumberNode(coeff),
    affine.toTree(),
  );
  return statementTree;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const statementTex = buildStatement(identifiers).toTex();
  return `Développer et réduire : $${statementTex}$`;
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { a, b, coeff } = identifiers;
  const affine = new Affine(a, b);
  return affine.times(coeff).toTree().toTex();
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Multiplie chaque terme dans la parenthèse par $${identifiers.coeff}$.`;
};

const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const { a, b, coeff } = identifiers;
  const statement = buildStatement(identifiers);
  const affine = new Affine(a, b);
  const answer = getAnswer(identifiers);
  return `${alignTex([
    [
      statement.toTex(),
      "=",
      new AddNode(
        new MultiplyNode(
          new NumberNode(coeff),
          new MultiplyNode(new NumberNode(affine.a), "x".toTree()),
          { forceTimesSign: true },
        ),
        new MultiplyNode(new NumberNode(coeff), new NumberNode(affine.b)),
      ).toTex(),
    ],
    ["", "=", answer],
  ])}`;
};

const getSimpleDistributivityQuestion: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(undefined, {
    excludes: [0],
  });
  const coeff = randint(-10, 11, [-1, 0, 1]);
  const identifiers = { a: affine.a, b: affine.b, coeff: coeff };
  const question: Question<Identifiers> = {
    instruction: getInstruction(identifiers),
    startStatement: buildStatement(identifiers).toTex(),
    answer: getAnswer(identifiers),
    keys: ["x"],
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
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
  getAnswer,
  getCorrection,
  getHint,
  getInstruction,
};
