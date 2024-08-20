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
import { earthG, earthGravityAcceleration } from "#root/pc/constants/gravity";
import { earthGravity } from "#root/pc/constants/mechanics/gravitational";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { EnergyUnit } from "#root/pc/units/energyUnit";
import { MassUnit } from "#root/pc/units/massUnits";
import { PowerUnit } from "#root/pc/units/powerUnits";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  mass: number;
  height: number;
};

const getPotentialEnergy: QuestionGenerator<Identifiers> = () => {
  const mass = Math.floor(Math.random() * 10 + 1); // Masse de l'objet entre 1 et 11 kg
  const massMeasure = new Measure(mass, 0, MassUnit.kg);
  const height = Math.floor(Math.random() * 50 + 1); // Hauteur par rapport à la référence entre 1 et 51 m
  const heightMeasure = new Measure(height, 0, DistanceUnit.m);

  const potentialEnergy = mass * 9.81 * height;

  const instruction = `Un objet de masse $${massMeasure.toTex({
    notScientific: true,
  })}$ est suspendu à une hauteur de $${heightMeasure.toTex({
    notScientific: true,
  })}$. Il est ensuite relâché et tombe librement.
  $\\\\$ Calculer l'énergie potentielle de l'objet. (Supposons que l'accélération due à la gravité est de $${earthGravityAcceleration.measure
    .toSignificant(2)
    .toTex()}$)`;

  const answer = `${frenchify(
    round(potentialEnergy, 2),
  )}${EnergyUnit.J.toTex()}`;
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
  return [ans, ans.replace("J", EnergyUnit.J.toTex())].includes(answer);
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
