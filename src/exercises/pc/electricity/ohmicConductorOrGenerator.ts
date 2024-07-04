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
import { random } from "#root/utils/random";

type Identifiers = {};

const getOhmicConductorOrGeneratorQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    commands: exo.ggb.commands,
    coords: [20, 40, -5, 30],
    keys: [],
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Conducteur ohmique", "raw");
  tryToAddWrongProp(propositions, "Générateur", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = () => {
  const type = random(["Conducteur ohmique", "Générateur"]);
  const ggb = getGgb(type);
  const instruction = `Après avoir relevé l'intensité du courant circulant dans un dipôle pour différentes tensions entre ses bornes, Nous avons obetnu le graphique ci-dessous.
  
  La dipôle est-elle est un générateur ou un conducteur ohmique ?`;
  return {
    instruction,
    ggb,
    answer: type,
  };
};

const getGgb = (type: string) => {
  const points = [];
  for (let x = 22; x < 33; x += 2) {
    const y =
      type === "Conducteur ohmique"
        ? Math.pow(10, 15) / Math.pow(x, 10)
        : 0.00000001 * Math.pow(x, 6);
    points.push(`Point({${x},${y}})`);
  }
  return type === "Conducteur ohmique"
    ? new GeogebraConstructor(
        [
          `Function(${Math.pow(10, 15)}/x^10,1,${randint(40, 51)})`,
          `Text("\\tiny{T}",(39,-2),true,true)`,
          `Text("\\tiny{R(\\Omega)}",(20,29),true,true)`,
        ].concat(points),
        {},
      )
    : new GeogebraConstructor(
        [
          `Function(0.00000001*x^6,1,${randint(40, 51)})`,
          `Text("\\tiny{T}",(39,-2),true,true)`,
          `Text("\\tiny{R(\\Omega)}",(20,29),true,true)`,
        ].concat(points),
        {},
      );
};

export const ohmicConductorOrGenerator: Exercise<Identifiers> = {
  id: "ohmicConductorOrGenerator",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getOhmicConductorOrGeneratorQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
