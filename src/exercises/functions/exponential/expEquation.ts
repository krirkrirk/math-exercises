import {
  MathExercise,
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
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/shuffle";

/**ae^x = k */
type Identifiers = {
  a: number;
  k: number;
};

const getExpEquation: QuestionGenerator<Identifiers> = () => {
  const a = randint(-9, 20, [0]);
  const k = a > 0 ? randint(1, 20) : randint(-20, 0);

  const equation = new EqualNode(
    new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode("x"))),
    new NumberNode(k),
  );
  const answer = new EquationSolutionNode(
    new DiscreteSetNode([new LogNode(new Rational(k, a).simplify().toTree())]),
  ).toTex();

  const question: Question<Identifiers> = {
    instruction: `Résoudre l'équation $${equation.toTex()}$.`,
    answer: answer,
    keys: [
      "x",
      "equal",
      "epower",
      "exp",
      "ln",
      "S",
      "lbrace",
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
          new LogNode(new Rational(randomK, randomA).simplify().toTree()),
        ]),
      ).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, k }) => {
  const answer = new EquationSolutionNode(
    new DiscreteSetNode(
      [
        new LogNode(
          new Rational(k, a)
            .simplify()
            .toTree({ allowFractionToDecimal: true }),
        ),
      ],
      { allowRawRightChildAsSolution: true },
    ),
  );
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const expEquation: MathExercise<Identifiers> = {
  id: "expEquation",
  connector: "=",
  label: "Résoudre des équations de type $a \\times \\exp(x) = k$",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  sections: ["Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
