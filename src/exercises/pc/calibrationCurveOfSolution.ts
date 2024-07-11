import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { molecules } from "#root/pc/molecularChemistry/molecule";
import { arrayEqual } from "#root/utils/arrayEqual";
import { random } from "#root/utils/random";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";
import { getPointFromGGB } from "../utils/geogebra/getPointFromGGB";
import { isGGBPoint } from "../utils/geogebra/isGGBPoint";

type Identifiers = {
  epsilon: number;
  l: number;
};

const getCalibrationCurveOfSolutionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const minY = 5 * exo.epsilon * exo.l - 10;
  const maxY = 15 * exo.epsilon * exo.l + 10;

  const question: Question<Identifiers> = {
    ggbAnswer: [
      `(1,${exo.epsilon * exo.l})`,
      `(2,${2 * exo.epsilon * exo.l})`,
      `Line(A, B)`,
    ],
    instruction: exo.instruction,
    keys: [],
    studentGgbOptions: {
      coords: [-2, 20, minY, maxY],
      isXAxesNatural: true,
      isAxesRatioFixed: false,
      enableShiftDragZoom: true,
      axisLabels: ["$\\tiny{[Xi]}$", "$\\tiny{A}$"],
    },
    hint: `Utilier la formule $a=c\\cdot l\\cdot ε$`,
    correction: `1 - Choisir deux coordonnées $x_1$ et $x_2$. \n \\
    2 - Calculer $a_1 = x_1\\cdot l \\cdotε$ et $a_2 = x_2\\cdot l \\cdotε$. \n \\
    3 - Tracer la droite qui passe par les deux points $(x_1,a_1)$ $(x_2,a_2)$.`,
    identifiers: {
      epsilon: exo.epsilon,
      l: exo.l,
    },
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (
  ans,
  { ggbAnswer, epsilon, l },
) => {
  if (arrayEqual(ans, ggbAnswer)) return true;
  const points = ans
    .filter((command) => isGGBPoint(command))
    .map((value) => getPointFromGGB(value, ""));
  return (
    points.length !== 0 &&
    points.every(
      (value) => value.getXnumber() * epsilon * l === value.getYnumber(),
    )
  );
};

const generateExercise = () => {
  const molecule = random(molecules);
  const epsilon = randint(1, 3);
  const l = randint(1, 3);
  const instruction = `Dans un laboratoire, vous avez effectué l'étalonnage d'une solution ${
    requiresApostropheBefore(molecule.name) ? "d'" : "de "
  }${molecule.name}. \n 
  Vous disposez du coefficient d'extinction molaire $ε$ de $${epsilon}$ $L/(mol·cm)$ et de la longueur de la cuve $l$ de $${l}$ $cm$. \n
  Tracer la courbe d'étalonnage de cette solution.`;
  return {
    instruction,
    epsilon,
    l,
  };
};

export const calibrationCurveOfSolution: Exercise<Identifiers> = {
  id: "calibrationCurveOfSolution",
  label: "Tracer une courbe d'étalonnage",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Spectrophotométrie"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalibrationCurveOfSolutionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  answerType: "GGB",
  subject: "Physique",
};
