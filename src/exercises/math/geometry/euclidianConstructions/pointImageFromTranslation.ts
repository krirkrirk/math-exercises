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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { approxEqual } from "#root/geogebra/parsers/approxEqual";
import { ggbPointToCoords } from "#root/geogebra/parsers/ggbPointToCoords";
import { parseGGBPoints } from "#root/geogebra/parsers/parseGGBPoints";
import {
  Point,
  PointConstructor,
  PointIdentifiers,
} from "#root/math/geometry/point";
import { Vector, VectorConstructor } from "#root/math/geometry/vector";
import { random } from "#root/utils/alea/random";
import { doWhile } from "#root/utils/doWhile";
import { randomLetter } from "#root/utils/strings/randomLetter";

type Identifiers = {
  points: PointIdentifiers[];
  startPoint: string;
  translationPoints: string[];
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Placer l'image du point $${identifiers.startPoint}$ par la translation qui transforme $${identifiers.translationPoints[0]}$ en $${identifiers.translationPoints[1]}$.`;
};

const getEndPoint = (identifiers: Identifiers) => {
  const translationPoints = [
    PointConstructor.fromIdentifiers(
      identifiers.points.find(
        (p) => p.name === identifiers.translationPoints[0],
      )!,
    ),
    PointConstructor.fromIdentifiers(
      identifiers.points.find(
        (p) => p.name === identifiers.translationPoints[1],
      )!,
    ),
  ];
  const vector = VectorConstructor.fromPoints(
    translationPoints[0],
    translationPoints[1],
  );

  const startPoint = PointConstructor.fromIdentifiers(
    identifiers.points.find((p) => p.name === identifiers.startPoint)!,
  );
  const end = vector.getEndPoint(startPoint, "M");
  return end;
};
// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};
const getGGBAnswer: GetGGBAnswer<Identifiers> = (identifiers) => {
  return getEndPoint(identifiers).toGGBCommand();
};

const getStudentGGBOptions: GetStudentGGBOptions<Identifiers> = (
  identifiers,
) => {
  const points = identifiers.points.map((p) =>
    PointConstructor.fromIdentifiers(p),
  );
  const end = getEndPoint(identifiers);
  const ggb = new GeogebraConstructor({
    hideAxes: true,
    isGridSimple: true,
    customToolBar: toolBarConstructor({ point: true }),
    commands: points.flatMap((p) =>
      p.toGGBCommand({
        size: 3,
        style: 1,
      }),
    ),
  });
  const [endX, endY] = [end.x.evaluate(), end.y.evaluate()];
  return ggb.getOptions({
    coords: [
      Math.min(endX - 2, -7),
      Math.max(endX + 2, 7),
      Math.min(endY - 2, -7),
      Math.max(endY + 2, 7),
    ],
  });
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  const studentAns = ans.filter((c) => !["A", "B", "C", "D"].includes(c[0]));
  if (studentAns.length !== 1) return false;
  const coords = ggbPointToCoords(studentAns[0].split("=")[1]);
  const coordsAns = ggbPointToCoords(ggbAnswer[0].split("=")[1]);
  return (
    approxEqual(coords.x, coordsAns.x, 0.2) &&
    approxEqual(coords.y, coordsAns.y, 0.2)
  );
};

const getPointImageFromTranslationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const points: Point[] = [];
  for (let i = 0; i < 4; i++) {
    const name = String.fromCharCode(65 + i);
    const newPoint = doWhile(
      () => PointConstructor.random(name, -4, 5),
      (p) => points.some((p2) => p.equals(p2)),
    );
    points.push(newPoint);
  }
  const startPoint = random(points).name;
  const translationPoints = [
    random(points.filter((p) => p.name !== startPoint)).name,
  ];
  translationPoints.push(
    random(points.filter((p) => p.name !== translationPoints[0])).name,
  );
  const identifiers: Identifiers = {
    points: points.map((p) => p.toIdentifiers()),
    startPoint,
    translationPoints,
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

export const pointImageFromTranslation: Exercise<Identifiers> = {
  id: "pointImageFromTranslation",
  label: "Placer l'image d'un point par une translation",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getPointImageFromTranslationQuestion, nb),
  ggbTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getGGBAnswer,
  getStudentGGBOptions,
  answerType: "GGB",
};
