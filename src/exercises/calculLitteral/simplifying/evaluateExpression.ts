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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  rand: boolean;
  poly1: number[];
  poly2: number[];
  xValue: number;
};

const getEvaluateExpression: QuestionGenerator<Identifiers> = () => {
  const rand = coinFlip();
  const polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const polynome2 = new Polynomial([
    randint(-9, 10),
    randint(-9, 10),
    randint(-4, 5, [0]),
  ]);
  const xValue = randint(-9, 10);

  const statement = rand
    ? `Calculer $${polynome1.toTree().toTex()}$ pour $x = ${xValue}$.`
    : `Calculer $${polynome2.toTree().toTex()}$ pour $x = ${xValue}$.`;

  const answer = rand
    ? polynome1.calculate(xValue) + ""
    : polynome2.calculate(xValue) + "";

  const question: Question<Identifiers> = {
    instruction: statement,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: {
      rand,
      poly1: polynome1.coefficients,
      poly2: polynome2.coefficients,
      xValue,
    },
  };
  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = Number(answer) + randint(-10, 11, [0]);

    tryToAddWrongProp(propositions, wrongAnswer + "");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const evaluateExpression: MathExercise<Identifiers> = {
  id: "evaluateExpression",
  connector: "=",
  label: "Evaluer une expression",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro"],
  sections: ["Calcul littéral"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getEvaluateExpression, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
