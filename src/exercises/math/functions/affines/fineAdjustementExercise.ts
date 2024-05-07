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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import {
  CloudPoints,
  CloudPointsConstructor,
} from "#root/math/geometry/CloudPoints";
import { Point } from "#root/math/geometry/point";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  xValues: number[];
  yValues: number[];
};

const getFineAdjustementExerciseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const cloudPoints = CloudPointsConstructor.randomLinear(5);
  const xValues = cloudPoints.points.map((element) => {
    return element.getXnumber();
  });
  const yValues = cloudPoints.points.map((element) => {
    return element.getYnumber();
  });
  const commands = cloudPoints.points.map((point) => {
    return `${point.name}=Point({${point.getXnumber()},${point.getYnumber()}})`;
  });
  commands.push(
    ...cloudPoints.points.map((point) => {
      return `SetFixed(${point.name},true)`;
    }),
  );

  const ggb = new GeogebraConstructor(commands, { isGridSimple: true });

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  const question: Question<Identifiers> = {
    answer: cloudPoints.getCorrelationCoeff().simplify().toTex(),
    instruction: ``,
    commands: ggb.commands,
    coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    keys: [],
    answerFormat: "tex",
    identifiers: { xValues, yValues },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  let random: number;
  let flip: boolean;
  while (propositions.length < n) {
    flip = coinFlip();
    random = flip ? Math.random() : -Math.random();
    tryToAddWrongProp(propositions, +answer + random + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { xValues, yValues }) => {
  const points = xValues.map((value, i) => {
    return new Point(
      `a${i}`,
      new NumberNode(value),
      new NumberNode(yValues[i]),
    );
  });
  const cloudPoints = new CloudPoints(points);
  const answer = cloudPoints.getFineAdjustement();
  return answer.toAllValidTexs().includes(ans);
};
export const fineAdjustementExercise: Exercise<Identifiers> = {
  id: "fineAdjustementExercise",
  label: "",
  levels: [],
  isSingleStep: true,
  hasGeogebra: true,
  answerType: "QCM",
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getFineAdjustementExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
