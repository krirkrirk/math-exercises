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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { GeogebraParser } from "#root/geogebra/parsers/geogebraParser";
import { approxEqual } from "#root/geogebra/parsers/approxEqual";

type Identifiers = {
  x: number;
  y: number;
};

const getDrawAVectorInGgbQuestion: QuestionGenerator<Identifiers> = () => {
  const x = randint(-3, 3);
  const y = x === 0 ? randint(-3, 3, [0]) : randint(-3, 3);
  const vector = new Vector("u", x.toTree(), y.toTree());
  const studentGGB = new GeogebraConstructor({
    isGridSimple: true,
    customToolBar: toolBarConstructor({
      vector: true,
    }),
  });
  const question: Question<Identifiers> = {
    ggbAnswer: [`Vector[(0, 0), (${x}, ${y})]`],
    instruction: `Tracer le vecteur $${vector.toTex()}${vector.toInlineCoordsTex()}$`,
    keys: [],
    studentGgbOptions: studentGGB.getOptions({
      coords: [-5, 5, -6, 6],
    }),
    answerFormat: "tex",
    identifiers: { x, y },
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer, x, y }) => {
  const parser = new GeogebraParser(ans);
  const vectors = parser.vectors();
  if (vectors.length !== 1) return false;
  const vector = vectors[0];
  return approxEqual(vector[0], x) && approxEqual(vector[1], y);
};

export const drawAVectorInGGB: Exercise<Identifiers> = {
  id: "drawAVectorInGGB",
  label: "Tracer un vecteur",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Géométrie cartésienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getDrawAVectorInGgbQuestion, nb),
  ggbTimer: 60,
  answerType: "GGB",
  isGGBAnswerValid,
  subject: "Mathématiques",
};
