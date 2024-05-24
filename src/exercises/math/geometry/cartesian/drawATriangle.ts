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
import { arrayHasSameElements } from "#root/utils/arrayHasSameElements";
import { random } from "#root/utils/random";

type Identifiers = {};

const triangles = [
  { AB: 3, AC: 4, BC: 5 },
  { AB: 4, AC: 5, BC: 6 },
  { AB: 5, AC: 6, BC: 7 },
  { AB: 4, AC: 6, BC: 7 },
  { AB: 5, AC: 7, BC: 8 },
  { AB: 6, AC: 7, BC: 8 },
  { AB: 5, AC: 5, BC: 7 },
  { AB: 6, AC: 6, BC: 8 },
  { AB: 5, AC: 5, BC: 8 },
  { AB: 2, AC: 2, BC: 4 },
];

const getDrawATriangleQuestion: QuestionGenerator<Identifiers> = () => {
  const triangle = random(triangles);
  const ab = triangle.AB;
  const ac = triangle.AC;
  const bc = triangle.BC;

  const question: Question<Identifiers> = {
    ggbAnswer: [
      `(1;1)`,
      `(1;${ab + 1})`,
      `Circle(A, ${ab})`,
      `Circle(A, ${ac})`,
      `Circle(B, ${bc})`,
    ],
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
      enableShiftDragZoom: true,
      coords: [-6, 6, -10, 10],
      initialCommands: [
        "A=Point({1,1})",
        "ShowLabel(A,true)",
        `B=Point({1,${ab + 1}})`,
        "ShowLabel(B,true)",
      ],
    },
    identifiers: {},
  };

  return question;
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  console.log(ans);
  return ggbAnswer.every((cmnd) => ans.includes(cmnd));
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
