import {
  Exercise,
  GGBVEA,
  Question,
  QuestionGenerator,
} from "#root/exercises/exercise";
import { isGGBLine } from "#root/exercises/utils/geogebra/isGGBLine";
import { isGGBPoint } from "#root/exercises/utils/geogebra/isGGBPoint";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { Point } from "#root/math/geometry/point";
import { AffineConstructor } from "#root/math/polynomials/affine";
import { arrayEqual } from "#root/utils/arrayEqual";

type Identifiers = {
  correctA: number;
  correctB: number;
};

const getDrawAlineInGgbQuestion: QuestionGenerator<Identifiers> = () => {
  const f = AffineConstructor.random({ min: -3, max: 3 });
  const yA = f.b;
  const yB = f.a + f.b;
  const yMax = Math.max(yA, yB, 0);
  const yMin = Math.min(yA, yB, 0);
  const question: Question<Identifiers> = {
    ggbAnswer: [`(0,${yA})`, `(1,${yB})`, `Line[A, B]`],
    instruction: `Tracer la droite $d$ d'équation $y=${f.toTex()}$.`,
    keys: [],
    answerFormat: "tex",
    studentGgbOptions: {
      customToolBar: toolBarConstructor({
        join: true,
      }),
      xAxisSteps: 1,
      yAxisSteps: 1,
      coords: [-6, 6, yMin - 5, yMax + 5],
      isGridSimple: true,
    },
    identifiers: { correctA: f.a, correctB: f.b },
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (
  ans,
  { ggbAnswer, correctA, correctB },
) => {
  const studentAnswer = ans.map((s) => s.split("=")[1]);
  console.log(studentAnswer);
  if (arrayEqual(studentAnswer, ggbAnswer)) return true;
  if (studentAnswer.length !== 3) return false;
  if (
    !isGGBPoint(studentAnswer[0]) ||
    !isGGBPoint(studentAnswer[1]) ||
    !isGGBLine(studentAnswer[2])
  )
    return false;
  const A = getPoint(studentAnswer[0], "A");
  const B = getPoint(studentAnswer[1], "B");
  const a =
    (B.getYnumber() - A.getYnumber()) / (B.getXnumber() - A.getXnumber());
  const b = A.getYnumber() - a * A.getXnumber();
  return a === correctA && b === correctB;
};

const getPoint = (command: string, pointName: string) => {
  const splitted = command.split(",");
  const x = +splitted[0].replace("(", "");
  const y = +splitted[1].replace(")", "");
  return new Point(pointName, x.toTree(), y.toTree());
};

export const drawAlineInGGB: Exercise<Identifiers> = {
  id: "drawAlineInGGB",
  label: "Tracer une droite à partir de son équation réduite",
  levels: ["2nde"],
  isSingleStep: true,
  answerType: "GGB",
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getDrawAlineInGgbQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
