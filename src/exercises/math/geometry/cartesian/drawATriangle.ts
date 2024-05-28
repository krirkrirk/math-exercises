import {
  Exercise,
  GGBVEA,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getPointFromGGB } from "#root/exercises/utils/geogebra/getPointFromGGB";
import { isGGBLine } from "#root/exercises/utils/geogebra/isGGBLine";
import { isGGBPoint } from "#root/exercises/utils/geogebra/isGGBPoint";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Point } from "#root/math/geometry/point";
import { distBetweenTwoPoints } from "#root/math/utils/distBetweenTwoPoints";
import { random } from "#root/utils/random";

type Identifiers = {
  ac: number;
};

const triangles = [
  { AB: 3, AC: 4, BC: 5 },
  { AB: 4, AC: 5, BC: 6 },
  { AB: 5, AC: 6, BC: 7 },
  { AB: 4, AC: 6, BC: 7 },
  { AB: 5, AC: 7, BC: 8 },
  { AB: 6, AC: 7, BC: 8 },
  { AB: 5, AC: 5, BC: 7 },
  { AB: 6, AC: 6, BC: 8 },
  { AB: 5, AC: 5, BC: 8 },
  { AB: 2, AC: 2, BC: 4 },
];

const getDrawATriangleQuestion: QuestionGenerator<Identifiers> = () => {
  const triangle = random(triangles);
  const ab = triangle.AB;
  const ac = triangle.AC;
  const bc = triangle.BC;

  const question: Question<Identifiers> = {
    ggbAnswer: [`Line(A, B)`, `Line(A, C)`, `Circle(B, C)`],
    instruction: `Dessiner le triangle $ABC$ en sachant que : $AB=${ab}$, $AC=${ac}$ et $BC=${bc}$`,
    keys: [],
    answerFormat: "tex",
    studentGgbOptions: {
      customToolBar: toolBarConstructor({
        point: true,
        join: true,
        intersect: true,
        circleWithRadius: true,
      }),
      enableShiftDragZoom: true,
      coords: [-6, 6, -10, 10],
      initialCommands: [
        "A=Point({1,1})",
        "ShowLabel(A,true)",
        `B=Point({1,${ab + 1}})`,
        "ShowLabel(B,true)",
      ],
    },
    identifiers: { ac },
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer, ac }) => {
  if (ans.length > 10) return false;
  let c = undefined;
  let lines = [];
  for (let i = 2; i < ans.length; i++) {
    if (isGGBLine(ans[i])) lines.push(ans[i]);
    if (isGGBPoint(ans[i]) && c === undefined) c = getPointFromGGB(ans[i], "C");
  }
  const ansAc = Math.floor(
    distBetweenTwoPoints(new Point("x", (1).toTree(), (1).toTree()), c!),
  );
  return ansAc === ac && checkLines(lines);
};

const checkLines = (lines: string[]): boolean => {
  const forcedLines = ["Line(A, B)", "Line(B, A)"];

  if (lines.length !== 3) return false;
  if (!lines.includes(forcedLines[0]) && !lines.includes(forcedLines[1]))
    return false;
  if (lines.includes("Line(A, C)") || lines.includes("Line(C, A)")) {
    return lines.includes("Line(B, C)") || lines.includes("Line(C, B)");
  }
  return lines.includes("Line(B, D)") || lines.includes("Line(D, B)");
};

export const drawATriangle: Exercise<Identifiers> = {
  id: "drawATriangle",
  label: "Dessiner un triangle à partir de deux points.",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) => getDistinctQuestions(getDrawATriangleQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  answerType: "GGB",
  subject: "Mathématiques",
};
