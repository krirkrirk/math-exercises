import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  period: number;
  splinePoints: number[][];
};

const getFindPeriodFromGraphQuestion: QuestionGenerator<Identifiers> = () => {
  const period = randint(2, 5);

  const yStart = randint(0, 4);
  const splinePoints = [[0, yStart]];
  const isFirstNegative = coinFlip();
  const quarter = period / 4;
  splinePoints.push([
    quarter,
    yStart + (isFirstNegative ? randfloat(-2, -5) : randfloat(2, 5)),
  ]);
  const half = period / 2;
  splinePoints.push([half, yStart]);
  const threeQuarter = (3 * period) / 4;
  splinePoints.push([
    threeQuarter,
    yStart + (isFirstNegative ? randfloat(2, 5) : randfloat(-2, -5)),
  ]);
  splinePoints.push([period, yStart]);
  const color = randomColor();
  const commands = [
    `S =Spline(${splinePoints
      .map((point) => `(${point[0]},${point[1]})`)
      .join(",")})`,
    "SetFixed(S, true)",
    `SetColor(S, "${color}")`,
  ];
  for (let i = 1; i < 10; i++) {
    commands.push(
      `S_{${i}} = Translate(S, (${i * period}, 0))`,
      `SetFixed(S_{${i}}, true)`,
      `SetColor(S_{${i}}, "${color}")`,
    );
  }
  const ggb = new GeogebraConstructor(commands, {
    axisLabels: ["$\\tiny Temps (ms)$", "$\\tiny Tension (V)$"],
    isGridSimple: true,
  });
  const question: Question<Identifiers> = {
    answer: period + "",
    instruction: `L'enregistrement d'un signal sonore est donnée ci-dessous. Déterminer la période de ce signal.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { period, splinePoints },
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [0, 20, -8, 8],
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, period }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-3, 6) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const findPeriodFromGraph: Exercise<Identifiers> = {
  id: "findPeriodFromGraph",
  label: "Lire la période d'un signal sonore",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Son"],
  generator: (nb: number) =>
    getDistinctQuestions(getFindPeriodFromGraphQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  hasGeogebra: true,
};
