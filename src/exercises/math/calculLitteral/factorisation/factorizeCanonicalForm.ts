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
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";

type Identifiers = {
  a: number;
  b: number;
};

//(x-a)^2-b^2 avec b entier
const getFactorizeCanonicalFormQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const affine = new Affine(1, randint(-10, 10, [0]));
  const b = randint(-10, 10, [0]);

  const statement = new SubstractNode(
    new SquareNode(affine.toTree()),
    new SquareNode((b ** 2).toTree()),
  );
  const answer = new MultiplyNode(
    affine.add(-b).toTree(),
    affine.add(b).toTree(),
  ).toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Factoriser : $${statement.toTex()}$`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(a, b);
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      affine.add(-(b ** 2)).toTree(),
      affine.add(b ** 2).toTree(),
    ).toTex(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        new Affine(1, randint(-10, 10)).toTree(),
        new Affine(1, randint(-10, 10)).toTree(),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, b }) => {
  const affine = new Affine(1, a);

  const answerTree = new MultiplyNode(
    affine.add(-b).toTree(),
    affine.add(b).toTree(),
  );
  return answerTree.toAllValidTexs().includes(ans);
};

export const factorizeCanonicalForm: Exercise<Identifiers> = {
  id: "factorizeCanonicalForm",
  connector: "=",
  label: "Factoriser une expression du type $(x-a)^2-b^2$ avec $b$ entier",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFactorizeCanonicalFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
