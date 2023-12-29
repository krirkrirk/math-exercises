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
const getImageFunctionGeogebra: QuestionGenerator<Identifiers> = () => {
  const rand = coinFlip();
  const xValue = randint(-5, 6);

  let polynome1;
  do {
    polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  } while (
    polynome1.calculate(xValue) > 10 ||
    polynome1.calculate(xValue) < -10
  );

  let polynome2;
  do {
    polynome2 = new Polynomial([
      randint(-9, 10),
      randint(-9, 10),
      randint(-4, 5, [0]),
    ]);
  } while (
    polynome2.calculate(xValue) > 10 ||
    polynome2.calculate(xValue) < -10
  );

  const statement = `Quelle est l'image de $${xValue}$ par la fonction $f$ représentée ci dessous ?`;

  const answer = rand
    ? polynome1.calculate(xValue)
    : polynome2.calculate(xValue);

  let xmin, xmax, ymin, ymax: number;

  if (answer > 0) {
    ymax = answer + 1;
    ymin = -1;
  } else {
    ymin = answer - 1;
    ymax = 1;
  }

  if (xValue > 0) {
    xmax = xValue + 1;
    xmin = -1;
  } else {
    xmin = xValue - 1;
    xmax = 1;
  }

  const commands = [rand ? polynome1.toString() : polynome2.toString()];
  const answerTex = answer + "";
  const question: Question<Identifiers> = {
    instruction: statement,
    startStatement: `f(${xValue})`,
    answer: answerTex,
    keys: [],
    commands,
    coords: [xmin, xmax, ymin, ymax],
    answerFormat: "tex",
    identifiers: {
      poly1: polynome1.coefficients,
      poly2: polynome2.coefficients,
      rand,
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
export const imageFunctionGeogebra: MathExercise<Identifiers> = {
  id: "imageFunctionGeogebra",
  connector: "=",
  label: "Lecture d'une image",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Fonctions"],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getImageFunctionGeogebra, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
