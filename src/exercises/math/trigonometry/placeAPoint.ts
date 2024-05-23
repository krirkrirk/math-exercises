import {
  Exercise,
  GGBVEA,
  Question,
  QuestionGenerator,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { toolBarConstructor } from "#root/geogebra/toolBarConstructor";
import { PointConstructor } from "#root/math/geometry/point";
import { arrayHasSameElements } from "#root/utils/arrayHasSameElement";

type Identifiers = {};

const getPlaceAPointQuestion: QuestionGenerator<Identifiers> = () => {
  const point = PointConstructor.random("A");

  const xMax = point.getXnumber() + 2;
  const xMin = point.getXnumber() - 2;
  const yMin = point.getYnumber() - 2;
  const yMax = point.getYnumber() + 2;

  const question: Question<Identifiers> = {
    ggbAnswer: [`(${point.getXnumber()},${point.getYnumber()})`],
    instruction: `Placer le point ${point.toTexWithCoords()}$`,
    keys: [],
    studentGgbOptions: {
      customToolBar: toolBarConstructor({
        point: true,
      }),
      coords: [xMin, xMax, yMin, yMax],
      isGridSimple: true,
      isXAxesNatural: true,
    },
    identifiers: {},
  };
  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  if (arrayHasSameElements(ans, ggbAnswer)) return true;
  if (ans.includes(ggbAnswer[0])) return true;
  return false;
};

export const testGGBAnswer: Exercise<Identifiers> = {
  id: "placeAPoint",
  label: "Placer un point dans un repère orthonormé",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getPlaceAPointQuestion, nb),
  answerType: "GGB",
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
