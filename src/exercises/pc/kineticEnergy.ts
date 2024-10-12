import {
  Exercise,
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { frenchify } from "#root/math/utils/latex/frenchify";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/alea/shuffle";

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

  const answer = `${frenchify(round(kineticEnergy / 1000, 2))} \\ kJ`;
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
      frenchify(
        round((kineticEnergy / 1000) * (0.3 + Math.random() * 1.5), 2),
      ) + " \\ kJ",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const kineticEnergy: Exercise<Identifiers> = {
  id: "kineticEnergy",
  connector: "=",
  label: "Calculer l'énergie cinétique",
  levels: ["4ème", "3ème", "2nde", "1reSpé"],
  sections: ["Mécanique"],
  subject: "Physique",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getKineticEnergyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
