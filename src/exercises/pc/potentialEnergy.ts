import {
  Proposition,
  Question,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  tryToAddWrongProp,
  VEA,
  Exercise,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { frenchify } from "#root/math/utils/latex/frenchify";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  mass: number;
  height: number;
};

const getPotentialEnergy: QuestionGenerator<Identifiers> = () => {
  const mass = Math.floor(Math.random() * 10 + 1); // Masse de l'objet entre 1 et 11 kg
  const height = Math.floor(Math.random() * 50 + 1); // Hauteur par rapport à la référence entre 1 et 51 m
  const gravitationalAcceleration = 9.81; // Accélération due à la gravité en m/s²

  const potentialEnergy = mass * 9.81 * height;

  const instruction = `Un objet de masse $${mass} \\ \\text{kg}$ est suspendu à une hauteur de $${height}\\ \\text{m}$. Il est ensuite relâché et tombe librement.
  $\\\\$ Calculer l'énergie potentielle de l'objet. (Supposons que l'accélération due à la gravité est de $9,81 \\ \\text{m}\\cdot \\text{s}^{-2}$)`;

  const answer = `${frenchify(round(potentialEnergy, 2))}J`;
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
      frenchify(round(potentialEnergy * (0.3 + Math.random() * 1.5), 2)) + "J",
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const potentialEnergy: Exercise<Identifiers> = {
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
