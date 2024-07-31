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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { DivideUnits } from "#root/pc/units/divideUnits";
import { MassUnit } from "#root/pc/units/massUnits";
import { TimeUnit } from "#root/pc/units/timeUnits";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  isAsking: string;
  mass: number;
  velocity: number;
  kineticEnergy: number;
};

const speedUnit = new DivideUnits(DistanceUnit.m, TimeUnit.s);

const getKineticEnergyOrMassOrSpeedQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = getExericse();

  const question: Question<Identifiers> = {
    instruction: exercise.instruction,
    startStatement: "Ec",
    answer: exercise.answer,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      isAsking: exercise.isAsking,
      mass: exercise.mass,
      velocity: exercise.velocity,
      kineticEnergy: exercise.kineticEnergy,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isAsking, mass, velocity, kineticEnergy },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const nbAnswer = getAnswer(isAsking, mass, velocity, kineticEnergy);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      frenchify(randfloat(nbAnswer - 10, nbAnswer + 11, 2, [nbAnswer])) + "",
    );
  }
  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, mass }) => {
  console.log(new Measure(mass, 0, MassUnit.kg).toTex({ notScientific: true }));
  return ans === answer;
};

const getExericse = () => {
  const mass = randint(900, 1501);
  const massMeasure = new Measure(mass, 0, MassUnit.kg);
  const velocity = Math.floor(Math.random() * 20 + 10);
  const velocityMeasure = new Measure(velocity, 0, speedUnit);

  const kineticEnergy = round((0.5 * mass * velocity ** 2) / 1000, 2);

  const isAsking = random(["la masse", "l'énergie cinétique", "la vitesse"]);

  const instruction = getInstruction(
    isAsking,
    massMeasure,
    velocityMeasure,
    kineticEnergy,
  );

  const answer = frenchify(
    round(getAnswer(isAsking, mass, velocity, kineticEnergy), 2),
  );

  return {
    instruction,
    answer,
    mass,
    velocity,
    kineticEnergy,
    isAsking,
  };
};

const getAnswer = (
  isAsking: string,
  mass: number,
  velocity: number,
  kineticEnergy: number,
): number => {
  switch (isAsking) {
    case "l'énergie cinétique":
      return (0.5 * mass * velocity ** 2) / 1000;
    case "la masse":
      return (kineticEnergy * 1000 * 2) / velocity ** 2;
    case "la vitesse":
      return Math.sqrt((kineticEnergy * 1000 * 2) / mass);
  }
  return 0;
};

const getInstruction = (
  isAsking: string,
  massMeasure: Measure,
  velocityMeasure: Measure,
  kineticEnergy: number,
) => {
  switch (isAsking) {
    case "l'énergie cinétique":
      return `Une voiture ayant une masse de $${massMeasure.toTex(
        {},
      )}$ qui se déplace le long d'une route. La voiture accélère et atteint une vitesse de $${velocityMeasure.toTex()}$.
   $\\\\$ Calculer l'énergie cinétique (en $\\text{kJ}$) de la voiture lorsqu'elle atteint cette vitesse.`;
    case "la masse":
      return `Une voiture ayant une énergie cinétique de $${kineticEnergy}\\ \\text{kJ}$ qui se déplace le long d'une route. La voiture accélère et atteint une vitesse de $${velocityMeasure.toTex()}$.
   $\\\\$ Calculer la masse (en $${MassUnit.kg.toTex()}$) de la voiture lorsqu'elle atteint cette vitesse, arrondie au centiéme.`;
    case "la vitesse":
      return `Une voiture ayant une masse de $${massMeasure.toTex()}$ qui se déplace le long d'une route. L'énergie cinétique de la voiture est de $${kineticEnergy}\\ \\text{kJ}$.
   $\\\\$ Calculer la vitesse (en $${speedUnit.toTex()}$) de la voiture, arrondie au centiéme.`;
  }
  return "";
};
export const kineticEnergyOrMassOrSpeed: Exercise<Identifiers> = {
  id: "kineticEnergyOrMassOrSpeed",
  connector: "=",
  label: "Calculer l'énergie cinétique",
  levels: ["4ème", "3ème", "2nde", "1reSpé"],
  sections: ["Mécanique"],
  subject: "Physique",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getKineticEnergyOrMassOrSpeedQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
