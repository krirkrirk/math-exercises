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

  const question: Question<Identifiers> = {
    ggbAnswer: [
      `(1;${exo.epsilon * exo.l})`,
      `(2;${2 * exo.epsilon * exo.l})`,
      `Line(A, B)`,
    ],
    instruction: exo.instruction,
    keys: [],
    studentGgbOptions: {
      coords: [10, 20, -2, 20],
      isXAxesNatural: true,
      initialCommands: [`Text("\\tiny{[Xi]}",(29;0.2),true,true)`],
    },
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
  Vous disposez du coefficient d'extinction molaire $(ϵ)$ de $${epsilon}$ $L/(mol·cm)$ et de la longueur de la cuve $(l)$ de $${l}$ $cm$. \n
  Tracer la courbe d'étalonnage de cette solution.`;
  return {
    instruction,
    epsilon,
    l,
  };
};

export const calibrationCurveOfSolution: Exercise<Identifiers> = {
  id: "calibrationCurveOfSolution",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getCalibrationCurveOfSolutionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  answerType: "GGB",
  subject: "Physique",
};
