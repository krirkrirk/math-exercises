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
  velocity: number;
};

const getKineticEnergyQuestion: QuestionGenerator<Identifiers> = () => {
  const mass = Math.floor(Math.random() * 50 + 90) * 10; // Masse de la voiture entre 900 et 1500 kg
  const velocity = Math.floor(Math.random() * 20 + 10); // Vitesse de la voiture en m/s

  const kineticEnergy = 0.5 * mass * velocity ** 2;

  const instruction = `Une voiture ayant une masse de $${mass}$ kg qui se déplace le long d'une route. La voiture accélère et atteint une vitesse de $${velocity}$ m/s.
   $\\\\$ Calculer l'énergie cinétique (en kJ) de la voiture lorsqu'elle atteint cette vitesse.`;

  const answer = `${round(kineticEnergy / 1000, 2)} \\ kJ`;
  const question: Question<Identifiers> = {
    instruction,
    startStatement: "Ec",
    answer,
    keys: ["kJ"],
    answerFormat: "tex",
    identifiers: { mass, velocity },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, mass, velocity },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const kineticEnergy = 0.5 * mass * velocity ** 2;

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      round((kineticEnergy / 1000) * (0.3 + Math.random() * 1.5), 2) + " \\ kJ",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const kineticEnergy: ScienceExercise<Identifiers> = {
  id: "kineticEnergy",
  connector: "=",
  label: "Calculer l'énergie cinétique",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Mécanique"],
  subject: "Physique",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getKineticEnergyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
