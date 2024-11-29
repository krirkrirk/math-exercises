import {
  Exercise,
  Question,
  QuestionGenerator,
  GGBVEA,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { deleteObjectNamesFromAnswer } from "#root/geogebra/deleteObjectNamesFromAnswer";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { ggbPointToCoords } from "#root/geogebra/parsers/ggbPointToCoords";
import { parseGGBPoints } from "#root/geogebra/parsers/parseGGBPoints";
import { Point } from "#root/math/geometry/point";
import { Segment } from "#root/math/geometry/segment";
import { randfloat } from "#root/math/utils/random/randfloat";
import { round } from "#root/math/utils/round";
import { arrayEqual } from "#root/utils/arrays/arrayEqual";

type Identifiers = {
  lengths: number[];
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Construire un triangle dont les côtés mesurent $${identifiers.lengths[0].frenchify()}$ cm, $${identifiers.lengths[1].frenchify()}$ cm et $${identifiers.lengths[2].frenchify()}$ cm.`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};
const getGGBAnswer: GetGGBAnswer<Identifiers> = (identifiers) => {
  return [
    `A=(0,0)`,
    `B=Point(Circle(A,${identifiers.lengths[0]}))`,
    `C_1 = Circle(B,${identifiers.lengths[1]})`,
    `C_2 = Circle(A,${identifiers.lengths[2]})`,
    `C = Intersect(C_1,C_2,1)`,
    `Polygon(A,B,C)`,
  ];
};

const getStudentGGBOptions: GetStudentGGBOptions<Identifiers> = (
  identifiers,
) => {
  const ggb = new GeogebraConstructor({
    commands: [],
    customToolBar: toolBarConstructor({
      point: true,
      intersect: true,
      circleRadius: true,
      // circleTwoPoints: true,
      // segment: true,
      segmentFixed: true,
      polygon: true,
    }),
    hideAxes: true,
    hideGrid: true,
  });
  return ggb.getOptions({
    coords: [-8, 8, -8, 8],
  });
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer, lengths }) => {
  let points: any[] = [];
  const polygone = ans.find((c) => c.includes("Polygon"));
  if (polygone) {
    const names = polygone
      .split("=")[1]
      .replace("(", "")
      .replace(")", "")
      .replace("[", "")
      .replace("]", "")
      .replace("Polygon", "")
      .replaceAll(" ", "")
      .split(",");
    points = names.map((n) => {
      const command = ans.find((c) => c.startsWith(n + "="));
      if (!command) throw Error("Point not found");
      return ggbPointToCoords(command.split("=")[1]);
    });
  } else {
    points = parseGGBPoints(ans).map((c) => ggbPointToCoords(c));
  }

  if (points.length !== 3) {
    return false;
  }
  const pointsNode = points.map(
    (p, i) => new Point("P" + i, p.x.toTree(), p.y.toTree()),
  );
  const lengthsAns = pointsNode
    .map((p, i) => new Segment(p, pointsNode[(i + 1) % 3]))
    .map((s) => round(s.getLength(), 1))
    .sort((a, b) => a - b);
  const sortedExpected = lengths.sort((a, b) => a - b);
  return arrayEqual(lengthsAns, sortedExpected);
};

const getBuildTriangleWithSizesQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const lengths: number[] = [];
  let a, b, c;
  do {
    a = randfloat(1, 10, 1);
    b = randfloat(1, 10, 1);
    c = randfloat(1, 10, 1);
  } while (a + b < c || a + c < b || b + c < a);
  lengths.push(a, b, c);
  const identifiers: Identifiers = {
    lengths,
  };
  const question: Question<Identifiers> = {
    ggbAnswer: getGGBAnswer(identifiers),
    instruction: getInstruction(identifiers),
    studentGgbOptions: getStudentGGBOptions(identifiers),
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

export const buildTriangleWithSizes: Exercise<Identifiers> = {
  id: "buildTriangleWithSizes",
  label: "Construire un triangle en connaissant les longueurs de ses côtés",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getBuildTriangleWithSizesQuestion, nb),
  ggbTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getGGBAnswer,
  getStudentGGBOptions,
  answerType: "GGB",
};
