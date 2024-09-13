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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  nValue: number;
  points: number[][];
  isArithmetic: boolean;
};

const getSequencePlotQuestion: QuestionGenerator<Identifiers> = () => {
  const isArithmetic = coinFlip();
  const a = isArithmetic ? randfloat(0.1, 0.5, 1) : randfloat(1.01, 1.1, 2);
  const b = randint(2, 10);

  const nMax = 10;
  const points: number[][] = [];

  for (let n = 0; n <= nMax; n++) {
    let u_n;
    if (isArithmetic) {
      const noise = randfloat(-2, 2, 1);
      u_n = a * n + b + noise;
    } else {
      const noise = randfloat(-2, 2, 1);
      u_n = b * Math.pow(a, n) + noise;
    }
    points.push([n, Math.round(u_n)]);
  }

  const nValue = randint(0, nMax);
  const u_nValue = points[nValue][1];

  const commands = points.map((point, index) => {
    return `A${index}=(${point[0]},${point[1]})`;
  });

  commands.push(
    ...points.map((_, index) => {
      return `SetFixed(A${index},true)`;
    }),
    ...points.map((_, index) => {
      return `SetLabelMode(A${index},1)`;
    }),
  );

  const ggb = new GeogebraConstructor({
    commands,
    xAxis: { natural: true },
  });
  const answer = u_nValue.toString();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Ci-dessous est tracé un nuage de points représentant les valeurs d'une suite $(u_n)$. Quelle est la valeur de $u_{${nValue}}$ ?`,
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({
        xMin: 0,
        xMax: nMax,
        yMin: Math.min(...points.map((p) => p[1])) - 2,
        yMax: Math.max(...points.map((p) => p[1])) + 2,
      }),
    }),

    keys: [],
    answerFormat: "raw",
    identifiers: { nValue, points, isArithmetic },
    hint: `$u_{${nValue}}$ est l'ordonnée du point d'absicsse $${nValue}$ dans le nuage de points.`,
    correction: `$u_{${nValue}}$ est l'ordonnée du point d'absicsse $${nValue}$ dans le nuage de points.

On lit donc : $u_{${nValue}}=${answer}$.
    `,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, nValue, points },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const correctValue = parseInt(answer);

  while (propositions.length < n) {
    const wrongAnswer = (correctValue + randint(-2, 2)).toString();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const sequencePlot: Exercise<Identifiers> = {
  id: "sequencePlot",
  label:
    "Lire graphiquement un terme d'une suite à partir d'un nuage de points",
  levels: ["1reSpé"],
  isSingleStep: true,
  hasGeogebra: true,
  sections: ["Suites"],
  generator: (nb: number) => getDistinctQuestions(getSequencePlotQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
