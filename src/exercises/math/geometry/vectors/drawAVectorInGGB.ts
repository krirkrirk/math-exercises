import {
  Exercise,
  Question,
  QuestionGenerator,
  GGBVEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { Vector } from "#root/math/geometry/vector";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getDrawAVectorInGgbQuestion: QuestionGenerator<Identifiers> = () => {
  const x = randint(-3, 3);
  const y = x === 0 ? randint(-3, 3, [0]) : randint(-3, 3);
  const vector = new Vector("u", x.toTree(), y.toTree());

  const question: Question<Identifiers> = {
    ggbAnswer: [``, ``, `(${x};${y})`],
    instruction: `Tracer le vecteur $${vector.toTex()}${vector.toInlineCoordsTex()}$`,
    keys: [],
    studentGgbOptions: {
      customToolBar: toolBarConstructor({
        vector: true,
      }),
      isGridSimple: true,
      coords: [-5, 5, -6, 6],
      enableShiftDragZoom: true,
    },
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  return ans.length === 3 && ans.includes(ggbAnswer[2]);
};

export const drawAVectorInGGB: Exercise<Identifiers> = {
  id: "drawAVectorInGGB",
  label: "Tracer un vecteur",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getDrawAVectorInGgbQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  answerType: "GGB",
  isGGBAnswerValid,
  subject: "Mathématiques",
};
