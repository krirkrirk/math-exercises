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

type Identifiers = {
  x: number;
  y: number;
};

const getDrawAVectorInGgbQuestion: QuestionGenerator<Identifiers> = () => {
  const x = randint(-3, 3);
  const y = x === 0 ? randint(-3, 3, [0]) : randint(-3, 3);
  const vector = new Vector("u", x.toTree(), y.toTree());

  const question: Question<Identifiers> = {
    ggbAnswer: [`Vector((-2, -2), (${-2 + x}, ${-2 + y}))`],
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
    identifiers: { x, y },
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer, x, y }) => {
  const vector = ans.find((s) => !!s.match(/[a-z]=/)?.length);
  if (!vector) return false;
  const points = vector
    .substring(vector.indexOf("["))
    .replaceAll("[", "")
    .replaceAll("]", "")
    .replaceAll(" ", "")
    .split(",");
  const origin = ans.find((s) => s[0] === points[0]);
  const end = ans.find((s) => s[0] === points[1]);
  if (!origin || !end) return false;
  const originCoords = origin
    .split("=")[1]
    .replaceAll("(", "")
    .replaceAll(")", "")
    .split(",");
  const endCoords = end
    .split("=")[1]
    .replaceAll("(", "")
    .replaceAll(")", "")
    .split(",");
  const coords = [
    Number(endCoords[0]) - Number(originCoords[0]),
    Number(endCoords[1]) - Number(originCoords[1]),
  ];
  return Number(coords[0]) === x && Number(coords[1]) === y;
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
