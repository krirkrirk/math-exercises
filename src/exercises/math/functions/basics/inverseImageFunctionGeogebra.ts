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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Affine } from "#root/math/polynomials/affine";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { Trinom } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

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
  let affine: Affine;
  let trinom: Trinom;
  let answer = "";
  let xMin = -1;
  let xMax = 1;
  let yMin = -1;
  let yMax = 1;
  let commands: string[];
  if (isAffine) {
    do {
      affine = new Affine(randint(-5, 6, [0]), randint(-9, 10));
      yValue = affine.calculate(xValue);
    } while (Math.abs(yValue) > 10);

    answer = xValue.toString().replace(".", ",");
    yMin = yValue;
    yMax = yValue;
    xMin = xValue;
    xMax = xValue;
    commands = [affine.toString()];
  } else {
    let roots: number[];
    yValue = randint(-5, 6);

    do {
      trinom = new Trinom(
        randint(-4, 5, [0]),
        randint(-9, 10),
        randint(-9, 10) - yValue,
      );
      roots = trinom.getRoots();
    } while (roots.some((root) => Math.abs(root) > 10));

    answer = !roots.length
      ? "\\text{Aucun}"
      : roots
          .map((r) => round(r, 1).toString().replace(".", ","))
          .join("\\text{ et }");
    const beta = trinom.getBeta() + yValue;
    yMin = trinom.a > 0 ? beta : roots.length ? yValue : beta - 5;
    yMax = trinom.a < 0 ? beta : roots.length ? yValue : beta + 5;
    xMax = roots.length ? Math.max(...roots) : -10;
    xMin = roots.length ? Math.min(...roots) : 10;

    commands = [
      `f(x) = ${
        yValue !== 0
          ? trinom.add(new Polynomial([yValue])).toString()
          : trinom.toString()
      }`,
      `SetColor(f, "${randomColor()}")`,
    ];
  }

  const statement = `Lire graphiquement le ou les antécédents de $${yValue}$ par la fonction $f$ représentée ci dessous.`;
  const ggb = new GeogebraConstructor({ commands });
  const question: Question<Identifiers> = {
    instruction: statement,
    answer,
    keys: ["et", "aucun"],
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    }),
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
export const inverseImageFunctionGeogebra: Exercise<Identifiers> = {
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
  hasGeogebra: true,
  subject: "Mathématiques",
};
