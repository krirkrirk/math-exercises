import {
  Exercise,
  GGBVEA,
  Question,
  QuestionGenerator,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { ToolBarConstructor } from "#root/geogebra/toolBarConstructor";
import { PointConstructor } from "#root/math/geometry/point";
import { arrayEqual } from "#root/utils/arrayEqual";

type Identifiers = {};

const getTestGgbAnswerQuestion: QuestionGenerator<Identifiers> = () => {
  const point = PointConstructor.random("A");

  const question: Question<Identifiers> = {
    ggbAnswer: [`(${point.getXnumber()},${point.getYnumber()})`],
    instruction: `Placer le point $A=(${point.getXnumber()},${point.getYnumber()})$`,
    keys: [],
    studentGgbOptions: {
      //customToolBar: ToolBarConstructor.default(),
      coords: [
        point.getXnumber() - 2,
        point.getXnumber() + 2,
        point.getYnumber() - 2,
        point.getYnumber() + 2,
      ],
    },
    identifiers: {},
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  if (arrayEqual(ans, ggbAnswer)) return true;
  if (ans.includes(ggbAnswer[0])) return true;
  return false;
};

export const testGGBAnswer: Exercise<Identifiers> = {
  id: "testGGBAnswer",
  label: "Placer un point dans un repère orthonormé",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getTestGgbAnswerQuestion, nb),
  answerType: "GGB",
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
