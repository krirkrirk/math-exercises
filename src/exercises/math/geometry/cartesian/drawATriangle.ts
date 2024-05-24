import {
  Exercise,
  GGBVEA,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { toolBarConstructor } from "#root/exercises/utils/geogebra/toolBarConstructor";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getDrawATriangleQuestion: QuestionGenerator<Identifiers> = () => {
  const ab = randint(2, 6);
  const ac = randint(2, 6);
  const bc = randint(Math.max(ab, ac) + 1, ab + ac + 1);

  const question: Question<Identifiers> = {
    ggbAnswer: [""],
    instruction: `Dessiner le triangle $ABC$ en sachant que : $AB=${ab}$, $AC=${ac}$ et $BC=${bc}$`,
    keys: [],
    answerFormat: "tex",
    studentGgbOptions: {
      customToolBar: toolBarConstructor({
        point: true,
        join: true,
        intersect: true,
        circleWithRadius: true,
      }),
    },
    identifiers: {},
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  console.log(ans);
  return false;
};

export const drawATriangle: Exercise<Identifiers> = {
  id: "drawATriangle",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getDrawATriangleQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  isGGBAnswerValid,
  answerType: "GGB",
  subject: "Mathématiques",
};
