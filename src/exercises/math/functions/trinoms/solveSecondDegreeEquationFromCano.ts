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
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";

type Identifiers = {
  coeffs: number[];
};

const getSolveSecondDegreeEquationFromCanoQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.randomNiceRoots();
  const statement = trinom.getCanonicalForm().toTex();
  const roots = trinom.getRootsNode();
  const answer = new EquationSolutionNode(new DiscreteSetNode(roots)).toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $f(x) = ${statement}$. Résoudre l'équation $f(x) = 0$.`,
    keys: [...equationKeys],
    answerFormat: "tex",
    identifiers: { coeffs: trinom.coefficients },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(
        new DiscreteSetNode(
          [randint(-9, 0), randint(1, 10)].map((e) => e.toTree()),
        ),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, coeffs }) => {
  const trinom = TrinomConstructor.fromCoeffs(coeffs);
  const roots = trinom.getRootsNode();

  const answerTree = new EquationSolutionNode(new DiscreteSetNode(roots), {
    opts: { allowFractionToDecimal: true, allowRawRightChildAsSolution: true },
  });
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  throw Error("GGBVea not implemented");
};
export const solveSecondDegreeEquationFromCano: Exercise<Identifiers> = {
  id: "solveSecondDegreeEquationFromCano",
  connector: "\\iff",
  label: "Résoudre une équation du type $a(x-b)^2 + c = 0$",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getSolveSecondDegreeEquationFromCanoQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
