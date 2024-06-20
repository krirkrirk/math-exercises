import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getRecognizeRefractionOrReflectionAnglesQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: `${randint(1, 100)}`,
    instruction: `${randint(1, 100)}`,
    keys: [],
    commands: exo.ggb.commands,
    coords: exo.coords,
    options: exo.ggb.getOptions(),
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const generateExercise = () => {
  const enetringLight = { x1: randint(-10, -5), y1: randint(5, 11) };
  const reflectionLight = { x2: -enetringLight.x1, y2: enetringLight.y1 };
  const commands = [
    `D = Vector((${enetringLight.x1},${enetringLight.y1}), (0,0))`,
    `R = Vector((0,0), (${reflectionLight.x2},${reflectionLight.y2}))`,
    `A = Angle(Line((0,0),(0,5)),Line((0,0),(${enetringLight.x1},${enetringLight.y1})))`,
    `ShowLabel(A,false)`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    isGridSimple: true,
  });

  const coords = [
    enetringLight.x1,
    reflectionLight.x2,
    enetringLight.x1,
    reflectionLight.x2,
  ];

  return {
    enetringLight,
    reflectionLight,
    commands,
    coords,
    ggb,
  };
};

export const recognizeRefractionOrReflectionAngles: Exercise<Identifiers> = {
  id: "recognizeRefractionOrReflectionAngles",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getRecognizeRefractionOrReflectionAnglesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
