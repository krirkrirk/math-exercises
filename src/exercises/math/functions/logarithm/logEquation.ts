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
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/shuffle";

/**aln(x)=k */
type Identifiers = {
  a: number;
  k: number;
};

const getLnEquation: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 20, [0]);
  const k = randint(-9, 20, [0]);

  const equation = new EqualNode(
    new MultiplyNode(new NumberNode(a), new LogNode(new VariableNode("x"))),

    new NumberNode(k),
  );

  const answer = new EquationSolutionNode(
    new DiscreteSetNode([new ExpNode(new Rational(k, a).simplify().toTree())]),
  ).toTex();

  const question: Question<Identifiers> = {
    instruction: `Résoudre l'équation $${equation.toTex()}$.`,
    answer,
    keys: [
      "x",
      "equal",
      "ln",
      "e",
      "epower",
      "exp",
      "lbrace",
      "S",
      "semicolon",
      "rbrace",
    ],
    answerFormat: "tex",
    identifiers: { a, k },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const randomA = randint(1, 10);
    const randomK = randint(1, 20);
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(
        new DiscreteSetNode([
          new ExpNode(new Rational(randomK, randomA).simplify().toTree()),
        ]),
      ).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, k }) => {
  const answer = new EquationSolutionNode(
    new DiscreteSetNode([
      new ExpNode(
        new Rational(k, a).simplify().toTree({ allowFractionToDecimal: true }),
      ),
    ]),
  );
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const logEquation: Exercise<Identifiers> = {
  id: "logEquation",
  connector: "=",
  label: "Résoudre des équations de type $a \\times \\ln(x) = k$",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  sections: ["Logarithme népérien", "Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnEquation, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
  isAnswerValid,
  subject: "Mathématiques",
};
