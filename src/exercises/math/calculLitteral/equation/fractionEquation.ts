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
import { Rational } from "#root/math/numbers/rationals/rational";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import {
  DiscreteSetNode,
  EmptySet,
} from "#root/tree/nodes/sets/discreteSetNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
};

const getFractionEquation: QuestionGenerator<Identifiers> = () => {
  // (ax + b)/(cx + d) = 0

  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10, [0]);
  const c = randint(-9, 10, [0]);
  const d = randint(-9, 10, [0]);

  const polynome1 = new Polynomial([b, a]);
  const polynome2 = new Polynomial([d, c]);

  const root1 = new Rational(-b, a).simplify().toTree().toTex();
  const root2 = new Rational(-d, c).simplify().toTree().toTex();
  const hasSolution = -d / c !== -b / a;
  const answer =
    -d / c === -b / a ? `S=\\varnothing` : `S=\\left\\{${root1}\\right\\}`;

  const statement = new EqualNode(
    new FractionNode(polynome1.toTree(), polynome2.toTree()),
    (0).toTree(),
  ).toTex();
  const question: Question<Identifiers> = {
    instruction: `Résoudre : $${statement}$`,

    startStatement: statement,
    answer,
    keys: [
      "x",
      "S",
      "equal",
      "lbrace",
      "rbrace",
      "semicolon",
      "ou",
      "varnothing",
    ],
    answerFormat: "tex",
    identifiers: { a, b, c, d },
    hint: `Un quotient est nul si est seulement si le numérateur est nul et le dénominateur est non nul. Il faut donc déterminer la valeur de $x$ qui rend le numérateur nul, sans rendre le dénominateur nul.`,
    correction: `Un quotient est nul si est seulement si le numérateur est nul et le dénominateur est non nul. Ainsi : 
  
${alignTex([
  ["", statement],
  ["\\iff", `${polynome1.toTex()}=0 \\text{ et } ${polynome2.toTex()}\\neq 0`],
  ["\\iff", `x=${root1} \\text{ et } x\\neq ${root2}`],
])}

${
  !hasSolution
    ? `Il n'y a donc pas de solution pour cette équation. Ainsi, $${answer}$.`
    : `Il y a donc bien une solution pour cette équation : $${answer}$.`
}
`,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, c, d },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new EquationSolutionNode(
      new DiscreteSetNode([new Rational(-d, c).simplify().toTree()]),
    ).toTex(),
  );
  while (propositions.length < n) {
    const a = randint(-9, 10, [0]);
    const b = randint(-9, 10, [0]);
    const wrongAnswer = `S=\\left\\{${new Rational(-b, a)
      .simplify()
      .toTree()
      .toTex()}\\right\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c, d }) => {
  const solutions =
    -d / c === -b / a
      ? EmptySet
      : new DiscreteSetNode([new Rational(-b, a).simplify().toTree()]);
  const answer = new EquationSolutionNode(solutions, {
    opts: { allowFractionToDecimal: true },
  });
  const validLatexs = answer.toAllValidTexs();
  return validLatexs.includes(ans);
};
export const fractionEquation: Exercise<Identifiers> = {
  id: "fractionEquation",
  connector: "\\iff",
  label: "Résoudre une équation quotient nul",
  levels: ["2nde", "1reESM", "1reSpé", "1reTech"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFractionEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
