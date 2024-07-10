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
import { random } from "#root/utils/random";

type Identifiers = {};

const getTypeOfAccelerationQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExo();

  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    commands: exo.ggb.object.commands,
    options: exo.ggb.object.getOptions(),
    coords: exo.ggb.coords,
    keys: [],
    answerFormat: "raw",
    identifiers: {},
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
  const typeOfAcceleration = random(["Accéléré", "Ralenti", "Constant"]);
  const ggb = generateGgb(typeOfAcceleration);
  const instruction = `D'apres le graphique ci-dessous qui represente la position d'un objet en fonction du temps, l'objet est en mouvement accéléré, en mouvement ralenti ou en mouvement constant ?.`;
  return {
    instruction,
    answer: typeOfAcceleration,
    ggb,
  };
};

const generateGgb = (typeOfAcceleration: string) => {
  const points = getPoints(typeOfAcceleration);
  return {
    object: new GeogebraConstructor(points.points, {
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
  switch (typeOfAcceleration) {
    case "Constant":
      let constant = randint(3, 10);
      while (n < 10) {
        points.push(`Point({${x},4})`);
        x = x + constant;
        n++;
      }
      coords = [-2, 50, -2, 20];
      break;
    case "Accéléré":
      let increaseStep = randint(2, 6);
      while (n < 10) {
        points.push(`Point({${x},4})`);
        x = x + increaseStep;
        increaseStep += 3;
        n++;
      }
      coords = [-2, x + 5, -2, 20];
      break;
    case "Ralenti":
      let decreaseStep = randint(10, 17);
      while (n < 10) {
        points.push(`Point({${x},4})`);
        x = x + decreaseStep;
        decreaseStep = decreaseStep * 0.8;
        n++;
      }
      coords = [-2, x + 5, -2, 20];
      break;
  }
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
  answerType: "QCM",
  subject: "Physique",
};
