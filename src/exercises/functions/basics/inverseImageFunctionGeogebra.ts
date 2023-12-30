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
  xValue: number;
  yValue: number;
  affineCoeffs: number[];
  trinomCoeffs: number[];
  isAffine: boolean;
};

const getInverseImageFunctionGeogebra: QuestionGenerator<Identifiers> = () => {
  const isAffine = coinFlip();
  const xValue = randint(-5, 6);
  const yValue = randint(-5, 6);

  let affine: Polynomial;
  do {
    affine = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  } while (affine.calculate(xValue) > 10 || affine.calculate(xValue) < -10);

  let trinom = new Polynomial([
    randint(-9, 10) - yValue,
    randint(-9, 10),
    randint(-4, 5, [0]),
  ]);
  let roots = trinom.getRoots();

  if (roots.length === 2)
    while (roots[0] > 10 || roots[0] < -10 || roots[1] > 10 || roots[1] < -10) {
      trinom = new Polynomial([
        randint(-9, 10) - yValue,
        randint(-9, 10),
        randint(-4, 5, [0]),
      ]);
      roots = trinom.getRoots();
    }
  else if (roots.length === 1)
    while (roots[0] < -10 || roots[0] > 10) {
      trinom = new Polynomial([
        randint(-9, 10) - yValue,
        randint(-9, 10),
        randint(-4, 5, [0]),
      ]);
      roots = trinom.getRoots();
    }

  const statement = isAffine
    ? `Déterminer le ou les antécédents de $${affine.calculate(
        xValue,
      )}$ par la fonction $f$ représentée ci dessous.`
    : `Déterminer le ou les antécédents de $${yValue}$ par la fonction $f$ représentée ci dessous.`;

  let answer = isAffine
    ? xValue
    : roots.length === 2
    ? `${round(roots[0], 1).toString().replace(".", ",")}\\text{ et }${round(
        roots[1],
        1,
      )
        .toString()
        .replace(".", ",")}`
    : roots.length === 1
    ? roots[0].toString().replace(".", ",")
    : `\\text{Aucun}`;

  const optimum = trinom.derivate().getRoots()[0];

  let xmin = 0,
    xmax = 0,
    ymin = 0,
    ymax = 0;

  if (isAffine) {
    if (affine.calculate(xValue) > 0) {
      ymax = affine.calculate(xValue) + 1;
      ymin = -1;
    } else {
      ymin = affine.calculate(xValue) - 1;
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
      if (yValue > trinom.calculate(optimum) + yValue) {
        ymax = yValue + 2;
        ymin = trinom.calculate(optimum) + yValue - 2;
      } else {
        ymin = yValue - 2;
        ymax = trinom.calculate(optimum) + yValue + 2;
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
      if (yValue > trinom.calculate(optimum) + yValue) {
        ymax = yValue + 1;
        ymin = trinom.calculate(optimum) + yValue - 3;
      } else {
        ymin = yValue - 1;
        ymax = trinom.calculate(optimum) + yValue + 3;
      }
      xmax = optimum + 5;
      xmin = optimum - 5;
    }
  }

  const commands = [
    isAffine
      ? affine.toString()
      : yValue !== 0
      ? trinom.add(new Polynomial([yValue])).toString()
      : trinom.toString(),
  ];

  answer = (answer + "").replaceAll(".", ",");
  const question: Question<Identifiers> = {
    instruction: statement,
    answer,
    keys: ["et", "aucun"],
    commands,
    coords: [xmin, xmax, ymin, ymax],
    answerFormat: "tex",
    identifiers: {
      xValue,
      affineCoeffs: affine.coefficients,
      trinomCoeffs: trinom.coefficients,
      yValue,
      isAffine,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, xValue, affineCoeffs, trinomCoeffs, yValue, isAffine },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const polynome1 = new Polynomial(affineCoeffs);
  const roots = new Polynomial(trinomCoeffs).getRoots();
  while (propositions.length < n) {
    const wrongAnswer = isAffine
      ? randint(-9, 10, [polynome1.calculate(xValue)])
      : roots.length === 2
      ? `${randint(-9, 10)}\\text{ et }${randint(-9, 10)}`.replaceAll(".", ",")
      : roots.length === 1
      ? randint(-9, 10, [roots[0]]).toString().replace(".", ",")
      : `\\text{Aucun}`;
    tryToAddWrongProp(propositions, wrongAnswer + "");
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, xValue, affineCoeffs, trinomCoeffs, yValue, isAffine },
) => {
  const antecedents: number[] = [];
  if (isAffine) {
    antecedents.push(xValue);
  } else {
    const trinom = new Polynomial(trinomCoeffs);
    const roots = trinom.getRoots();
    antecedents.push(...roots);
  }
  if (!antecedents.length) return ans === `\\text{Aucun}`;
  const studentNumbers = ans
    .split("\\text{ et }")
    .map((n) => Number(n.replace(",", ".")))
    .filter((n) => !isNaN(n))
    .sort((a, b) => a - b);
  antecedents.sort((a, b) => a - b);
  return (
    !!studentNumbers.length &&
    studentNumbers.every((nb, index) => Math.abs(nb - antecedents[index]) < 0.2)
  );
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
