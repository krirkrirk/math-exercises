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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  typeOfAcceleration: string;
  ggbCommands: string[];
};

const getTypeOfAccelerationQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExo();

  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    ggbOptions: exo.ggb.object.getOptions({
      coords: exo.ggb.coords,
    }),
    keys: [],
    answerFormat: "raw",
    identifiers: {
      typeOfAcceleration: exo.typeOfAcceleration,
      ggbCommands: exo.ggb.object.commands!,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Mouvement accéléré", "raw");
  tryToAddWrongProp(propositions, "Mouvement ralenti", "raw");
  tryToAddWrongProp(propositions, "Mouvement constant", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExo = () => {
  const typeOfAcceleration = random([
    "Mouvement accéléré",
    "Mouvement ralenti",
    "Mouvement constant",
  ]);
  const ggb = generateGgb(typeOfAcceleration);
  const instruction = `D'après le graphique ci-dessous qui représente la position d'un objet en fonction du temps, 
  
  déterminez si l'objet est en mouvement accéléré, en mouvement ralenti ou en mouvement constant.`;
  return {
    instruction,
    answer: typeOfAcceleration,
    ggb,
    typeOfAcceleration,
  };
};

const generateGgb = (typeOfAcceleration: string) => {
  const points = getPoints(typeOfAcceleration);
  return {
    object: new GeogebraConstructor({
      commands: points.points,
      hideAxes: true,
      hideGrid: true,
    }),
    coords: points.coords,
  };
};

const getPoints = (typeOfAcceleration: string) => {
  const points = [];
  let coords: number[] = [];
  let n = 0;
  let x = 0;
  let step = randint(3, 14);
  let variation = 1;
  if (typeOfAcceleration === "Mouvement accéléré") variation = 1.3;
  if (typeOfAcceleration === "Mouvement ralenti") {
    step = randint(10, 21);
    variation = 0.8;
  }
  while (n < 10) {
    points.push(`Point({${x},4})`);
    x = x + step;
    step = step * variation;
    n++;
  }
  coords = [-2, x + 5, -2, 20];
  return { points, coords };
};

export const typeOfAcceleration: Exercise<Identifiers> = {
  id: "typeOfAcceleration",
  label: "Déterminer le type d'accélération du mouvement d'un objet.",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique"],
  generator: (nb: number) =>
    getDistinctQuestions(getTypeOfAccelerationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  answerType: "QCU",
  subject: "Physique",
};
