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
  affineCoeffs?: number[];
  trinomCoeffs?: number[];
  isAffine: boolean;
};

const getInverseImageFunctionGeogebra: QuestionGenerator<Identifiers> = () => {
  const isAffine = coinFlip();
  const xValue = randint(-5, 6);
  // const yValue = randint(-5, 6);
  let yValue: number;
  let affine: Polynomial;
  let trinom: Polynomial;
  let statement = "";
  let answer = "";
  let xmin = -1;
  let xmax = 1;
  let ymin = -1;
  let ymax = 1;
  let commands: string[];
  if (isAffine) {
    do {
      affine = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
      yValue = affine.calculate(xValue);
    } while (Math.abs(yValue) > 10);

    statement = `Déterminer le ou les antécédents de $${yValue}$ par la fonction $f$ représentée ci dessous.`;
    answer = xValue.toString().replace(".", ",");
    if (yValue > 0) {
      ymax = yValue + 1;
      ymin = -1;
    } else {
      ymin = yValue - 1;
      ymax = 1;
    }
    if (xValue > 0) {
      xmax = xValue + 1;
      xmin = -1;
    } else {
      xmin = xValue - 1;
      xmax = 1;
    }
    commands = [affine.toString()];
  } else {
    let roots: number[];
    yValue = randint(-5, 6);

    do {
      trinom = new Polynomial([
        randint(-9, 10) - yValue,
        randint(-9, 10),
        randint(-4, 5, [0]),
      ]);
      roots = trinom.getRoots();
    } while (roots.some((root) => Math.abs(root) > 10));
    statement = `Déterminer le ou les antécédents de $${yValue}$ par la fonction $f$ représentée ci dessous.`;
    answer = !roots.length
      ? "\\text{Aucun}"
      : roots
          .map((r) => round(r, 1).toString().replace(".", ","))
          .join("\\text{ et }");
    const alpha = trinom.derivate().getRoots()[0];
    const beta = trinom.calculate(alpha);
    if (roots.length === 2) {
      if (yValue > beta + yValue) {
        ymax = yValue + 2;
        ymin = beta + yValue - 2;
      } else {
        ymin = yValue - 2;
        ymax = beta + yValue + 2;
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
      xmax = alpha + 5;
      xmin = alpha - 5;
    }

    if (roots.length === 0) {
      if (yValue > beta + yValue) {
        ymax = yValue + 1;
        ymin = beta + yValue - 3;
      } else {
        ymin = yValue - 1;
        ymax = beta + yValue + 3;
      }
      xmax = alpha + 5;
      xmin = alpha - 5;
    }

    commands = [
      yValue !== 0
        ? trinom.add(new Polynomial([yValue])).toString()
        : trinom.toString(),
    ];
  }

  const question: Question<Identifiers> = {
    instruction: statement,
    answer,
    keys: ["et", "aucun"],
    commands,
    coords: [xmin, xmax, ymin, ymax],
    answerFormat: "tex",
    identifiers: {
      xValue,
      affineCoeffs: isAffine ? affine!.coefficients : undefined,
      trinomCoeffs: isAffine ? undefined : trinom!.coefficients,
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
  tryToAddWrongProp(propositions, "\\text{Aucun}");

  if (isAffine) {
    const affine = new Polynomial(affineCoeffs!);
    tryToAddWrongProp(
      propositions,
      affine.calculate(yValue).toString().replace(".", ","),
    );
  } else {
    const trinom = new Polynomial(trinomCoeffs!);
    tryToAddWrongProp(
      propositions,
      trinom.calculate(yValue).toString().replace(".", ","),
    );
  }

  while (propositions.length < n) {
    const wrongAnswer = coinFlip()
      ? `${randint(-9, 10)}`
      : `${randint(-9, 10)}\\text{ et }${randint(-9, 10)}`;
    tryToAddWrongProp(propositions, wrongAnswer);
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
    const trinom = new Polynomial(trinomCoeffs!);
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
