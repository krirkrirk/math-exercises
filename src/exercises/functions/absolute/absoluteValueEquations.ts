import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { coinFlip } from "#root/utils/coinFlip";
import { probaFlip } from "#root/utils/probaFlip";

type Identifiers = {
  a: number;
  b: number;
};

const getAbsoluteValueEquationsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const poly = new Polynomial([randint(-9, 10, [0]), 1]);
  const a = probaFlip(0.9) ? randint(1, 10) : coinFlip() ? 0 : randint(-9, 0);
  //|x-b| = a
  const b = -poly.coefficients[0];
  const answer =
    a === 0
      ? `S=\\left\\{${b}\\right\\}`
      : a < 0
      ? `S=\\varnothing`
      : `S=\\left\\{${b - a};${b + a}\\right\\}`;

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'équation $|${poly.toTree().toTex()}| = ${a}$.`,
    keys: ["S", "equal", "varnothing", "lbrace", "semicolon", "rbrace"],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (a < 0) {
    tryToAddWrongProp(propositions, `S=\\left\\{${b - a};${b + a}\\right\\}`);
    tryToAddWrongProp(propositions, `S=\\left\\{${b + a}\\right\\}`);
  } else if (a === 0) {
    tryToAddWrongProp(propositions, `S=\\varnothing`);
  } else if (a > 0) {
    tryToAddWrongProp(propositions, `S=\\left\\{${b + a}\\right\\}`);
    tryToAddWrongProp(propositions, `S=\\left\\{${-b - a};${-b + a}\\right\\}`);
  }
  while (propositions.length < n) {
    const wrongAnswer = `S=\\left\\{${randint(-9, 0)};${randint(
      0,
      10,
    )}\\right\\}`;

    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const sols =
    a === 0
      ? [new NumberNode(b)]
      : a < 0
      ? []
      : [new NumberNode(b - a), new NumberNode(b + a)];
  const answer = new EquationSolutionNode(new DiscreteSetNode(sols));
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const absoluteValueEquations: MathExercise<Identifiers> = {
  id: "absoluteValueEquation",
  connector: "\\iff",
  label: "Résoudre une équation avec valeur absolue",
  levels: ["2nde", "1reESM"],
  isSingleStep: true,
  sections: ["Valeur absolue", "Équations"],
  generator: (nb: number) =>
    getDistinctQuestions(getAbsoluteValueEquationsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
