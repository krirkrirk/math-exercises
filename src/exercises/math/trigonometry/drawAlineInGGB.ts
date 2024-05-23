import {
  Exercise,
  GGBVEA,
  Question,
  QuestionGenerator,
} from "#root/exercises/exercise";
import { isGGBLine } from "#root/exercises/utils/geogebra/isGGBLine";
import { isGGBPoint } from "#root/exercises/utils/geogebra/isGGBPoint";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { toolBarConstructor } from "#root/geogebra/toolBarConstructor";
import { Point } from "#root/math/geometry/point";
import { AffineConstructor } from "#root/math/polynomials/affine";

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
    ggbAnswer: [`(0;${yA})`, `(1;${yB})`, `Line(A,B)`],
    instruction: `Dessiner la droite d'equation $f(x)=${f.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    studentGgbOptions: {
      customToolBar: toolBarConstructor({
        join: true,
      }),
      coords: [-4, 4, yMin - 1, yMax + 1],
      xAxisSteps: 1,
      yAxisSteps: 1,
      isGridSimple: true,
    },
    identifiers: { correctA: f.a, correctB: f.b },
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { correctA, correctB }) => {
  if (ans.length !== 3) return false;
  if (!isGGBPoint(ans[0]) || !isGGBPoint(ans[1]) || !isGGBLine(ans[2]))
    return false;
  const A = getPoint(ans[0], "A");
  const B = getPoint(ans[1], "B");
  const a =
    (B.getYnumber() - A.getYnumber()) / (B.getXnumber() - A.getXnumber());
  const b = a * A.getXnumber() - -A.getYnumber();
  return a === correctA && b === correctB;
};

const getPoint = (command: string, pointName: string) => {
  const splitted = command.split(";");
  const x = +splitted[0].replace("(", "");
  const y = +splitted[1].replace(")", "");
  return new Point(pointName, x.toTree(), y.toTree());
};

export const drawAlineInGGB: Exercise<Identifiers> = {
  id: "drawAlineInGGB",
  label: "test",
  levels: ["2nde"],
  isSingleStep: true,
  answerType: "GGB",
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDrawAlineInGgbQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
