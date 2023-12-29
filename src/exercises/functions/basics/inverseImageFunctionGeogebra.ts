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
import { round } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  roots: number[];
  xValue: number;
  polynome1Coeffs: number[];
};

const getInverseImageFunctionGeogebra: QuestionGenerator<Identifiers> = () => {
  const rand = coinFlip();
  const xValue = randint(-5, 6);
  const yValue = randint(-5, 6);

  let polynome1: Polynomial;
  do {
    polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  } while (
    polynome1.calculate(xValue) > 10 ||
    polynome1.calculate(xValue) < -10
  );

  let polynome2 = new Polynomial([
    randint(-9, 10) - yValue,
    randint(-9, 10),
    randint(-4, 5, [0]),
  ]);
  let roots = polynome2.getRoots();

  if (roots.length === 2)
    while (roots[0] > 10 || roots[0] < -10 || roots[1] > 10 || roots[1] < -10) {
      polynome2 = new Polynomial([
        randint(-9, 10) - yValue,
        randint(-9, 10),
        randint(-4, 5, [0]),
      ]);
      roots = polynome2.getRoots();
    }

  if (roots.length === 1)
    while (roots[0] < -10 || roots[0] > 10) {
      polynome2 = new Polynomial([
        randint(-9, 10) - yValue,
        randint(-9, 10),
        randint(-4, 5, [0]),
      ]);
      roots = polynome2.getRoots();
    }

  const statement = rand
    ? `Déterminer le ou les antécédents de $${polynome1.calculate(
        xValue,
      )}$ par la fonction $f$ représentée ci dessous.`
    : `Déterminer le ou les antécédents de $${yValue}$ par la fonction $f$ représentée ci dessous.`;

  let answer = rand
    ? xValue
    : roots.length === 2
    ? `\\left\\{${round(roots[0], 1)};${round(roots[1], 1)}\\right\\}`
    : roots.length === 1
    ? roots[0]
    : `\\emptyset`;

  const optimum = polynome2.derivate().getRoots()[0];

  let xmin = 0,
    xmax = 0,
    ymin = 0,
    ymax = 0;

  if (rand) {
    if (polynome1.calculate(xValue) > 0) {
      ymax = polynome1.calculate(xValue) + 1;
      ymin = -1;
    } else {
      ymin = polynome1.calculate(xValue) - 1;
      ymax = 1;
    }

    if (xValue > 0) {
      xmax = xValue + 1;
      xmin = -1;
    } else {
      xmin = xValue - 1;
      xmax = 1;
    }
  } else {
    if (roots.length === 2) {
      if (yValue > polynome2.calculate(optimum) + yValue) {
        ymax = yValue + 2;
        ymin = polynome2.calculate(optimum) + yValue - 2;
      } else {
        ymin = yValue - 2;
        ymax = polynome2.calculate(optimum) + yValue + 2;
      }
      xmax = Math.max(roots[0], roots[1]) + 1;
      xmin = Math.min(roots[0], roots[1]) - 1;
    }

    if (roots.length === 1) {
      if (yValue > 0) {
        ymax = yValue + 5;
        ymin = yValue - 1;
      } else {
        ymin = yValue - 5;
        ymax = yValue + 1;
      }
      xmax = optimum + 5;
      xmin = optimum - 5;
    }

    if (roots.length === 0) {
      if (yValue > polynome2.calculate(optimum) + yValue) {
        ymax = yValue + 1;
        ymin = polynome2.calculate(optimum) + yValue - 3;
      } else {
        ymin = yValue - 1;
        ymax = polynome2.calculate(optimum) + yValue + 3;
      }
      xmax = optimum + 5;
      xmin = optimum - 5;
    }
  }

  const commands = [
    rand
      ? polynome1.toString()
      : yValue !== 0
      ? polynome2.add(new Polynomial([yValue])).toString()
      : polynome2.toString(),
  ];

  answer = (answer + "").replaceAll(".", ",");
  const question: Question<Identifiers> = {
    instruction: statement,
    answer,
    keys: ["S", "equal", "lbrace", "rbrace", "semicolon", "emptyset", "et"],
    commands,
    coords: [xmin, xmax, ymin, ymax],
    answerFormat: "tex",
    identifiers: {
      roots,
      xValue,
      polynome1Coeffs: polynome1.coefficients,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, roots, xValue, polynome1Coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const polynome1 = new Polynomial(polynome1Coeffs);
  while (propositions.length < n) {
    const wrongAnswer = coinFlip()
      ? randint(-9, 10, [polynome1.calculate(xValue)])
      : roots.length === 2
      ? `\\{${randint(-9, 10)};${randint(-9, 10)} \\}`
      : roots.length === 1
      ? randint(-9, 10, [roots[0]])
      : `\\emptyset`;
    tryToAddWrongProp(propositions, wrongAnswer + "");
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const inverseImageFunctionGeogebra: MathExercise<Identifiers> = {
  id: "inverseImageFunctionGeogebra",
  connector: "\\iff",
  label: "Lecture d'antécédents",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Fonctions"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getInverseImageFunctionGeogebra, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
