import {
  Exercise,
  Question,
  QuestionGenerator,
  GGBVEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { VectorConstructor } from "#root/math/geometry/vector";

type Identifiers = {};

const getDrawAVectorInGgbQuestion: QuestionGenerator<Identifiers> = () => {
  const vector = VectorConstructor.random("u");

  const question: Question<Identifiers> = {
    ggbAnswer: [""],
    instruction: `Tracer le vecteur $${vector.toInlineCoordsTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  throw Error("GGBVea not implemented");
};
export const drawAVectorInGGB: Exercise<Identifiers> = {
  id: "drawAVectorInGGB",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDrawAVectorInGgbQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  subject: "Mathématiques",
};
