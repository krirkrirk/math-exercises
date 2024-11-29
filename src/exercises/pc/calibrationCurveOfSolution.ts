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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { molecules } from "#root/pc/constants/molecularChemistry/molecule";
import { arrayEqual } from "#root/utils/arrays/arrayEqual";
import { random } from "#root/utils/alea/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";
import { getPointFromGGB } from "../utils/geogebra/getPointFromGGB";
import { isGGBPoint } from "../utils/geogebra/isGGBPoint";
import { toolBarConstructor } from "../utils/geogebra/toolBarConstructor";

type Identifiers = {
  epsilon: number;
  l: number;
  molecule: string;
};

const getCalibrationCurveOfSolutionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const minY = 5 * exo.epsilon * exo.l - 10;
  const maxY = 10 * exo.epsilon * exo.l + 5;
  const studentGGB = new GeogebraConstructor({
    customToolBar: toolBarConstructor({
      join: true,
    }),
    xAxis: { label: "$\\small{C}$" },
    yAxis: { label: "$\\small{A}$" },
    lockedAxesRatio: false,
  });
  const question: Question<Identifiers> = {
    ggbAnswer: [
      `(5,${5 * exo.epsilon * exo.l})`,
      `(10,${10 * exo.epsilon * exo.l})`,
      `Line(A, B)`,
    ],
    instruction: exo.instruction,
    keys: [],
    studentGgbOptions: studentGGB.getOptions({
      coords: [-1, 5, -1, 6],
    }),
    hint: exo.hint,
    correction: exo.correction,
    identifiers: {
      epsilon: exo.epsilon,
      l: exo.l,
      molecule: exo.molecule.formula,
    },
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (
  ans,
  { ggbAnswer, epsilon, l },
) => {
  const studentAnswer = ans.map((s) => s.split("=")[1]);

  if (arrayEqual(studentAnswer, ggbAnswer)) return true;
  const points = studentAnswer
    .filter((command) => isGGBPoint(command))
    .map((value) => getPointFromGGB(value, "", false));
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
  Vous disposez du coefficient d'extinction molaire $\\varepsilon$ de $${epsilon}$ $\\text{L}\\cdot\\text{mol}^{-1}\\cdot\\text{cm}^{-1}$ et de la longueur de la cuve $l$ de $${l}$ $\\text{cm}$. \n
  Tracer la courbe d'étalonnage de cette solution.`;
  return {
    instruction,
    hint: getHint(),
    correction: getCorrection(),
    epsilon,
    l,
    molecule,
  };
};

const getCorrection = () => {
  return `1 - Choisir deux coordonnées $x_1$ et $x_2$. \n \\
    2 - Calculer $A_1 = x_1\\cdot l \\cdot \\varepsilon$ et $A_2 = x_2\\cdot l \\cdot \\varepsilon$. \n \\
    3 - Tracer la droite qui passe par les deux points $(x_1,A_1)$ et $(x_2,A_2)$.`;
};

const getHint = () => {
  return `Utiliser la formule $A=C\\cdot \\ell\\cdot \\varepsilon$, où :\n
- $A$ est l'absorbance (une grandeur sans unité)\n
- $\\varepsilon$ est le coefficient d'extinction molaire (ou coefficient d'absorption molaire) en $\\text{L}\\cdot\\text{mol}^{-1}\\cdot\\text{cm}^{-1}$\n
- $C$ est la concentration de la solution en $\\text{mol}\\cdot\\text{L}^{-1}$\n
- $\\ell$ est la longueur du chemin optique en centimètres $(\\text{cm})$`;
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
  hasHintAndCorrection: true,
};
