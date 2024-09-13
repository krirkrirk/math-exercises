import {
  Exercise,
  GGBVEA,
  Question,
  QuestionGenerator,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { PointConstructor } from "#root/math/geometry/point";
import { arrayHasSameElements } from "#root/utils/arrayHasSameElement";
import { deleteObjectNamesFromAnswer } from "#root/geogebra/deleteObjectNamesFromAnswer";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";

type Identifiers = { x: number; y: number };

const getPlaceAPointQuestion: QuestionGenerator<Identifiers> = () => {
  const point = PointConstructor.random("A");

  const xMax = point.getXnumber() + 2;
  const xMin = point.getXnumber() - 2;
  const yMin = point.getYnumber() - 2;
  const yMax = point.getYnumber() + 2;
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

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  return arrayHasSameElements(deleteObjectNamesFromAnswer(ans), ggbAnswer);
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
