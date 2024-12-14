import {
  Exercise,
  GGBVEA,
  Question,
  QuestionGenerator,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { PointConstructor } from "#root/math/geometry/point";
import { arrayHasSameElements } from "#root/utils/arrays/arrayHasSameElement";
import { deleteObjectNamesFromAnswer } from "#root/geogebra/deleteObjectNamesFromAnswer";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { getPointFromGGB } from "#root/exercises/utils/geogebra/getPointFromGGB";
import { parseGGBPoints } from "#root/geogebra/parsers/parseGGBPoints";

type Identifiers = { x: number; y: number };

const getPlaceAPointQuestion: QuestionGenerator<Identifiers> = () => {
  const point = PointConstructor.random("A");

  const studentGGB = new GeogebraConstructor({
    isGridSimple: true,
    customToolBar: toolBarConstructor({
      point: true,
    }),
  });
  const question: Question<Identifiers> = {
    ggbAnswer: [`(${point.getXnumber()},${point.getYnumber()})`],
    instruction: `Placer le point $A$ de coordonnées $${point.toTexWithCoords()}$.`,
    keys: [],
    studentGgbOptions: studentGGB.getOptions({
      coords: [-11, 11, -11, 11],
    }),
    identifiers: { x: point.x.evaluate({}), y: point.y.evaluate({}) },
  };
  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer, x, y }) => {
  const points = parseGGBPoints(ans);
  if (points.length !== 1) return false;
  const [xAns, yAns] = points[0].replace("(", "").replace(")", "").split(",");

  return Math.abs(Number(xAns) - x) < 0.5 && Math.abs(Number(yAns) - y) < 0.5;
};

export const testGGBAnswer: Exercise<Identifiers> = {
  id: "placeAPoint",
  label: "Placer un point dans un repère orthonormé",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getPlaceAPointQuestion, nb),
  answerType: "GGB",
  ggbTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
