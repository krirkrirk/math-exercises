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
import { isGGBLine } from "#root/exercises/utils/geogebra/isGGBLine";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { randomSegmentName } from "#root/exercises/utils/geometry/randomSegmentName";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { colors, greenDark } from "#root/geogebra/colors";
import { deleteObjectNamesFromAnswer } from "#root/geogebra/deleteObjectNamesFromAnswer";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Line } from "#root/math/geometry/line";
import { Point, PointConstructor } from "#root/math/geometry/point";
import { Segment } from "#root/math/geometry/segment";
import { LengthNode } from "#root/tree/nodes/geometry/lengthNode";

type Identifiers = {
  A: number[];
  B: number[];
};

const getBuildMediatriceWithCompassQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const segmentName = randomSegmentName();
  const A = segmentName[0];
  const B = segmentName[1];

  const pointA = PointConstructor.random(A);
  const pointB = PointConstructor.random(B);
  const segment = new Segment(pointA, pointB);
  const length = segment.getLength();
  const [xa, ya] = [pointA.x.evaluate({}), pointA.y.evaluate({})];
  const [xb, yb] = [pointB.x.evaluate({}), pointB.y.evaluate({})];

  const xMin = Math.min(xa, xb) - length;
  const xMax = Math.max(xa, xb) + length;
  const yMin = Math.min(ya, yb) - length;
  const yMax = Math.max(ya, yb) + length;

  const ggbAnswer = [
    ...pointA.toGGBCommand(),
    ...pointB.toGGBCommand(),
    `Seg = Segment(${A},${B})`,
    `C_1 = Circle(${A},${B})`,
    `C_2 = Circle(${B},${A})`,
    `I_1 = Intersect(C_1, C_2,1)`,
    `I_2 = Intersect(C_1, C_2,2)`,
    `Ans = Line(I_1,I_2)`,
    `SetColor(Ans, "${greenDark}")`,
  ];
  const studentGGB = new GeogebraConstructor({
    commands: [
      ...pointA.toGGBCommand(),
      ...pointB.toGGBCommand(),
      `Seg = Segment(${A},${B})`,
    ],
    hideGrid: true,
    hideAxes: true,
    customToolBar: toolBarConstructor({
      join: true,
      circleTwoPoints: true,
      intersect: true,
    }),
  });
  const question: Question<Identifiers> = {
    ggbAnswer: ggbAnswer,
    instruction: `Avec les outils disponibles, tracer la médiatrice du segment $[${segmentName}]$.`,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      A: [xa, ya],
      B: [xb, yb],
    },
    studentGgbOptions: studentGGB.getOptions({
      coords: [xMin, xMax, yMin, yMax],
    }),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer, A, B }) => {
  const lines = ans.filter((s) => isGGBLine(s));
  const segmentPointA = new Point("Seg_A", A[0].toTree(), A[1].toTree());
  const segmentPointB = new Point("Seg_B", B[0].toTree(), B[1].toTree());

  if (!lines.length) return false;
  for (const line of lines) {
    const formatted = line
      .replace(" ", "")
      .replace("Line", "")
      .replace("[", "")
      .replace("]", "")
      .split("=")[1];
    const [nameA, nameB] = formatted.split(",");
    const pointACmd = ans.find((s) => s.startsWith(nameA));
    const pointBCmd = ans.find((s) => s.startsWith(nameB));
    if (!pointACmd || !pointBCmd) return false;
    const pointA = PointConstructor.fromGGBCommand(pointACmd);
    const pointB = PointConstructor.fromGGBCommand(pointBCmd);

    if (
      pointA.distanceTo(segmentPointA) - pointA.distanceTo(segmentPointB) <
        0.0000001 &&
      pointB.distanceTo(segmentPointA) - pointB.distanceTo(segmentPointB) <
        0.0000001
    )
      return true;
  }
  return false;
};
export const buildMediatriceWithCompass: Exercise<Identifiers> = {
  id: "buildMediatriceWithCompass",
  connector: "=",
  label: "Tracer une médiatrice avec un compas",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getBuildMediatriceWithCompassQuestion, nb),
  ggbTimer: 60,
  getPropositions,
  isGGBAnswerValid,
  subject: "Mathématiques",
  answerType: "GGB",
};
