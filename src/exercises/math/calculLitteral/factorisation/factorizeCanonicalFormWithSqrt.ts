import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  SquareRoot,
  SquareRootConstructor,
} from "#root/math/numbers/reals/real";
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  a: number;
  bOperand: number;
};

const getFactorizeCanonicalFormWithSqrtQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = new Affine(1, randint(-2, 3, [0]));
  const b = SquareRootConstructor.randomIrreductible(10);

  const statement = new SubstractNode(
    new SquareNode(affine.toTree()),
    b.operand.toTree(),
  );
  const answer = new MultiplyNode(
    new SubstractNode(affine.toTree(), b.toTree()),
    new AddNode(affine.toTree(), b.toTree()),
  )
    .simplify({ forbidFactorize: true })
    .toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Factoriser : $${statement.toTex()}$`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.b, bOperand: b.operand },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, bOperand },
) => {
  const propositions: Proposition[] = [];
  const affine = new Affine(1, a);

  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      affine.add(bOperand).toTree(),
      affine.add(-bOperand).toTree(),
    ).toTex(),
  );
  while (propositions.length < n) {
    const randomSqrt = SquareRootConstructor.randomIrreductible(10);
    tryToAddWrongProp(
      propositions,

      new MultiplyNode(
        new SubstractNode(affine.toTree(), randomSqrt.toTree()),
        new AddNode(affine.toTree(), randomSqrt.toTree()),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, bOperand }) => {
  const affine = new Affine(1, a);
  const b = new SquareRoot(bOperand);
  const answerTree = new MultiplyNode(
    new SubstractNode(affine.toTree(), b.toTree()),
    new AddNode(affine.toTree(), b.toTree()),
  ).simplify({ forbidFactorize: true });
  return answerTree.toAllValidTexs().includes(ans);
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  throw Error("GGBVea not implemented");
};
export const factorizeCanonicalFormWithSqrt: Exercise<Identifiers> = {
  id: "factorizeCanonicalFormWithSqrt",
  connector: "=",
  label: "Factoriser une expression du type $(x-a)^2-b^2$ avec $b$ irrationnel",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFactorizeCanonicalFormWithSqrtQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
