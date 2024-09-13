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
import { Rational } from "#root/math/numbers/rationals/rational";
import { Affine } from "#root/math/polynomials/affine";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  a: number;
  b: number;
  type: number;
};

/**
 * Equation donnée sous forme ax^2 + bx ou bien forme développée d'une identité remarquable
 * type 1 ax^2 + bx
 * type 2 (ax+b)^2
 * type 3 (ax-b)^2
 * type 4 (ax+b)(ax-b)
 */
const getSolveSecondDegreeEquationByFactorisationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const type = randint(1, 4);
  let statement = "";
  let roots: AlgebraicNode[] = [];
  let answer = "";
  let a: number;
  let b: number;
  switch (type) {
    case 1:
      {
        //ax^2 + bx
        const trinom = new Trinom(randint(-9, 10, [0]), randint(-9, 10), 0);
        a = trinom.a;
        b = trinom.b;
        statement = trinom.toTex();
        roots = trinom.getRootsNode();
      }
      break;
    case 2:
      {
        //(ax+b)^2
        a = randint(-9, 10, [0]);
        b = randint(1, 10);
        statement = new Trinom(a ** 2, 2 * a * b, b ** 2).toTex();
        roots = [new Rational(-b, a).simplify().toTree()];
      }
      break;

    case 3:
      {
        //(ax-b)^2
        a = randint(-9, 10, [0]);
        b = randint(-9, 0, [0]);
        statement = new Trinom(a ** 2, -2 * a * b, b ** 2).toTex();
        roots = [new Rational(b, a).simplify().toTree()];
      }
      break;

    case 4:
    default:
      {
        //(ax+b)(ax-b)
        a = randint(-9, 10, [0]);
        b = randint(1, 10);
        statement = new Trinom(a ** 2, 0, -(b ** 2)).toTex();
        roots = [b, -b].sort((a, b) => a - b).map((x) => x.toTree());
      }
      break;
  }
  const instruction = `Soit $f(x) = ${statement}$. Factoriser $f(x)$, puis résoudre l'équation $f(x) = 0$.`;
  answer = new EquationSolutionNode(new DiscreteSetNode(roots)).toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: [...equationKeys],
    answerFormat: "tex",
    identifiers: { a, b, type },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const firstRoot = randint(-10, 10);
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(
        new DiscreteSetNode(
          coinFlip()
            ? [firstRoot.toTree()]
            : [firstRoot, randint(-10, 10, [firstRoot])]
                .sort((a, b) => a - b)
                .map((x) => x.toTree()),
        ),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, type, a, b }) => {
  let roots: AlgebraicNode[] = [];
  switch (type) {
    case 1:
      {
        const trinom = new Trinom(a, b, 0);
        roots = trinom.getRootsNode();
      }
      break;
    case 2:
      {
        roots = [new Rational(-b, a).simplify().toTree()];
      }
      break;

    case 3:
      {
        roots = [new Rational(b, a).simplify().toTree()];
      }
      break;

    case 4:
      {
        roots = [b, -b].sort((a, b) => a - b).map((x) => x.toTree());
      }
      break;
  }

  const answerTree = new EquationSolutionNode(new DiscreteSetNode(roots), {
    opts: { allowFractionToDecimal: true, allowRawRightChildAsSolution: true },
  });
  return answerTree.toAllValidTexs().includes(ans);
};

export const solveSecondDegreeEquationByFactorisation: Exercise<Identifiers> = {
  id: "solveSecondDegreeEquationByFactorisation",
  connector: "\\iff",
  label: "Résoudre une équation du second degré par factorisation",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(
      getSolveSecondDegreeEquationByFactorisationQuestion,
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
