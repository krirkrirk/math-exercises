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
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Point } from "#root/math/geometry/point";
import { distBetweenTwoPoints } from "#root/math/utils/distBetweenTwoPoints";
import { random } from "#root/utils/random";
import { distanceBetweenTwoPoints } from "./distanceBetweenTwoPoints";

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
    ggbAnswer: [
      `(1;1)`,
      `(1;${ab + 1})`,
      `Circle(A, ${ab})`,
      `Circle(A, ${ac})`,
      `Circle(B, ${bc})`,
    ],
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
  if (ggbAnswer.length > ans.length) return false;
  const c = getCPoint(ans);
  if (!c) return false;
  const acAns = Math.floor(
    distBetweenTwoPoints(new Point("x", (1).toTree(), (1).toTree()), c),
  );
  return (
    ggbAnswer.every((cmnd) => ans.includes(cmnd)) &&
    checkLines(ans) &&
    acAns === ac
  );
};

const checkLines = (ans: string[]): boolean => {
  const regex = /Line\([A-D], [A-D]\)/;
  let k = 0;
  for (let i = 0; i < ans.length; i++) {
    if (ans[i].match(regex)) k += 1;
  }
  return k === 3;
};

const getCPoint = (ans: string[]) => {
  const regex = /\(-?\d*\.?\d+\;-?\d*\.?\d+\)/;
  for (let i = 2; i < ans.length; i++) {
    if (ans[i].match(regex)) return getPointFromGGB(ans[i], "C");
  }
};

export const drawATriangle: Exercise<Identifiers> = {
  id: "drawATriangle",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getDrawATriangleQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  answerType: "GGB",
  subject: "Mathématiques",
};
