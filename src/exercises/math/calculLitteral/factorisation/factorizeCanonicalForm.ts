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
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { alignTex } from "#root/utils/alignTex";

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
    (b ** 2).toTree(),
  );
  const bPositive = Math.abs(b);

  const answer = new MultiplyNode(
    affine.add(-bPositive).toTree(),
    affine.add(bPositive).toTree(),
  ).toTex();
  const statementTex = statement.toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Factoriser : $${statementTex}$`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.a, b },
    hint: `Utilise l'identité remarquable $a^2 - b^2 = (a-b)(a+b)$`,
    correction: `
On utilise l'identité remarquable $ a^2 - b^2=(a-b)(a+b)$ en prenant $a=${affine.toTex()}$ et $b=${bPositive}$ : 

${alignTex([
  [
    statementTex,
    "=",
    new SubstractNode(
      new SquareNode(affine.toTree()),
      new SquareNode(bPositive.toTree()),
    ).toTex(),
  ],
  [
    "",
    "=",
    new MultiplyNode(
      new AddNode(affine.toTree(), (-bPositive).toTree()),
      new AddNode(affine.toTree(), bPositive.toTree()),
    ).toTex(),
  ],
  ["", "=", answer],
])}`,
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
  hasHintAndCorrection: true,
};
