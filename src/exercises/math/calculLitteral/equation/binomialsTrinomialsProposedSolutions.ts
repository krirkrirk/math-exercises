import {
  Exercise,
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
import { Trinom } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  solutionNodeIds: any;
  equationNodeIds: any;
};

function generateTrinomialFromRoot(root: number, constante: number): Trinom {
  const a = randint(1, 5);
  const r2 = randint(-10, 10, [0]);

  const b = -(root + r2);
  const c = root * r2;

  return new Trinom(a, a * b, a * c + constante);
}

const getBinomialsTrinomialsProposedSolutionsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const degree = coinFlip();
  const constante = randint(-10, 10);
  const root = randint(-10, 10, [0]);

  const trinomial = generateTrinomialFromRoot(root, constante);

  const a1 = randint(-10, 10, [0]);
  const b1 = randint(-10, 10);
  let a2;
  do {
    a2 = randint(-10, 10, [0]);
  } while (a2 === a1);

  const b2 = randint(-10, 10);
  const binomial1 = new Affine(a1, b1);
  const binomial2 = new Affine(a2, b2);

  const equation = degree
    ? new EqualNode(trinomial.toTree(), constante.toTree())
    : new EqualNode(binomial1.toTree(), binomial2.toTree());

  const ans = degree
    ? root.toTree()
    : new FractionNode(
        new SubstractNode(binomial2.b.toTree(), binomial1.b.toTree()),
        new SubstractNode(binomial1.a.toTree(), binomial2.a.toTree()),
      ).simplify();
  const answertype = coinFlip();
  const solution = answertype ? ans : randint(-10, 10).toTree();
  const answer = answertype ? "Oui" : "Non";

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Le nombre $${solution}$ est-il une solution de l'équation $${equation.toTex()}$ ?`,
    keys: [],
    answerFormat: "raw",
    identifiers: {
      equationNodeIds: equation.toIdentifiers(),
      solutionNodeIds: solution.toIdentifiers(),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");

  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const binomialsTrinomialsProposedSolutions: Exercise<Identifiers> = {
  id: "binomialsTrinomialsProposedSolutions",
  label: "Vérifier si un nombre est solution d'une équation",
  levels: ["1rePro"],
  isSingleStep: true,
  sections: ["Équations"],
  generator: (nb: number) =>
    getDistinctQuestions(getBinomialsTrinomialsProposedSolutionsQuestion, nb),
  answerType: "QCU",
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
