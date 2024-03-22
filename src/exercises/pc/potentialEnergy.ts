import {
  ScienceExercise,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { round } from "#root/exercises/utils/math/round";
import { shuffle } from "#root/exercises/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  mass: number;
  height: number;
};

const getPotentialEnergy: QuestionGenerator<Identifiers> = () => {
  const mass = Math.floor(Math.random() * 10 + 1); // Masse de l'objet entre 1 et 11 kg
  const height = Math.floor(Math.random() * 50 + 1); // Hauteur par rapport à la référence entre 1 et 51 m
  const gravitationalAcceleration = 9.81; // Accélération due à la gravité en m/s²

  const potentialEnergy = mass * 9.81 * height;

  const instruction = `Un objet de masse ${mass} kg est suspendu à une hauteur de ${height} mètres. Il est ensuite relâché et tombe librement.
  $\\\\$ Calculer l'énergie potentielle de l'objet. (Supposons que l'accélération due à la gravité est de 9,81 m/s²)`;

  const answer = `${round(potentialEnergy, 2)}  \\ J`;
  const question: Question<Identifiers> = {
    instruction,
    startStatement: "Ep",
    answer,
    keys: ["J"],
    answerFormat: "tex",
    identifiers: { height, mass },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, height, mass },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const potentialEnergy = mass * 9.81 * height;

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round(potentialEnergy * (0.3 + Math.random() * 1.5), 2) + " \\ J",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const potentialEnergy: ScienceExercise<Identifiers> = {
  id: "potentialEnergy",
  connector: "=",
  label: "Calculer l'énergie potentielle",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Mécanique"],
  subject: "Physique",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPotentialEnergy, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
