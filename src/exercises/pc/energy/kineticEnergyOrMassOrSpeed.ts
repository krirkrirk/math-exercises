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
import { DivideUnit } from "#root/pc/units/divideUnit";
import { EnergyUnit, energyValues } from "#root/pc/units/energyUnit";
import { MassUnit } from "#root/pc/units/massUnits";
import { TimeUnit } from "#root/pc/units/timeUnits";
import { random } from "#root/utils/alea/random";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  isAsking: string;
  mass: number;
  velocity: number;
  kineticEnergy: number;
};

const speedUnit = new DivideUnit(DistanceUnit.m, TimeUnit.s);

const getKineticEnergyOrMassOrSpeedQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = getExericse();

  const question: Question<Identifiers> = {
    instruction: exercise.instruction,
    answer: exercise.answer,
    hint: exercise.hint,
    correction: exercise.correction,
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
      frenchify(
        Number.isInteger(nbAnswer)
          ? randint(nbAnswer - 10, nbAnswer + 11, [nbAnswer])
          : randfloat(nbAnswer - 10, nbAnswer + 11, 2, [nbAnswer]),
      ) + "",
    );
  }
  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const getExericse = () => {
  const mass = randint(9, 16) * 100;
  const massMeasure = new Measure(mass, 0, MassUnit.kg);
  const velocity = Math.floor(Math.random() * 20 + 10);
  const velocityMeasure = new Measure(velocity, 0, speedUnit);

  const kineticEnergy = round((0.5 * mass * velocity ** 2) / 1000, 2);
  const kineticEnergyMeasure = new Measure(kineticEnergy, 0, EnergyUnit.kJ);
  const isAsking = random(["la masse", "l'énergie cinétique", "la vitesse"]);

  const hint = `L'énergie cinétique $(E_c)$ d'un objet en mouvement est donnée par la formule, $E_c=\\frac{1}{2}m \\times v^2$ :
- $m$ est la masse de l'objet en $(${MassUnit.kg.toTex()})$
- $v$ est la vitesse de l'objet en $(${new DivideUnit(
    DistanceUnit.m,
    TimeUnit.s,
  ).toTex()})$
- $E_c$ est l'énergie cinétique de l'objet en $(${EnergyUnit.J.toTex()})$`;

  const correction = getCorrection(
    isAsking,
    kineticEnergyMeasure,
    massMeasure,
    velocityMeasure,
  );

  const instruction = getInstruction(
    isAsking,
    massMeasure,
    velocityMeasure,
    kineticEnergyMeasure,
  );

  const answer = frenchify(
    round(getAnswer(isAsking, mass, velocity, kineticEnergy), 2),
  );

  return {
    instruction,
    answer,
    hint,
    correction,
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
  kineticEnergyMeasure: Measure,
) => {
  switch (isAsking) {
    case "l'énergie cinétique":
      return `Une voiture ayant une masse de $${massMeasure.toTex({
        notScientific: true,
      })}$ qui se déplace le long d'une route. La voiture accélère et atteint une vitesse de $${velocityMeasure.toTex(
        { notScientific: true },
      )}$.
      $\\\\$Calculer l'énergie cinétique (en $${EnergyUnit.kJ.toTex()}$) de la voiture lorsqu'elle atteint cette vitesse.`;

    case "la masse":
      return `Une voiture ayant une énergie cinétique de $${kineticEnergyMeasure.toTex(
        { notScientific: true },
      )}$ qui se déplace le long d'une route. La voiture accélère et atteint une vitesse de $${velocityMeasure.toTex(
        { notScientific: true },
      )}$.
      $\\\\$Calculer la masse (en $${MassUnit.kg.toTex()}$) de la voiture lorsqu'elle atteint cette vitesse.`;

    case "la vitesse":
      return `Une voiture ayant une masse de $${massMeasure.toTex({
        notScientific: true,
      })}$ qui se déplace le long d'une route. L'énergie cinétique de la voiture est de $${kineticEnergyMeasure.toTex(
        { notScientific: true },
      )}$.
      $\\\\$Calculer la vitesse (en $${speedUnit.toTex()}$) de la voiture.`;
  }

  return "";
};

const getCorrection = (
  isAsking: string,
  kineticEnergyMeasure: Measure<energyValues>,
  massMeasure: Measure,
  velocityMeasure: Measure,
) => {
  const kineticEnergyJ = kineticEnergyMeasure.convert("J");
  switch (isAsking) {
    case "l'énergie cinétique":
      return `Utiliser la formule de l'énergie cinétique, $E_c=\\frac{1}{2}m \\times v^2$:
1. $E_c=\\frac{1}{2} ${massMeasure.toTex({
        notScientific: true,
        hideUnit: true,
      })} \\times ${velocityMeasure.toTex({
        hideUnit: true,
        notScientific: true,
      })}^2\\ \\Rightarrow E_c=${kineticEnergyJ.toTex({
        notScientific: true,
      })}$
2. Convertir les $${EnergyUnit.J.toTex()}$ en $${EnergyUnit.kJ.toTex()}$, $E_c=\\frac{${kineticEnergyJ.toTex(
        {
          notScientific: true,
        },
      )}}{1000} \\Rightarrow E_c=${kineticEnergyMeasure.toTex({
        notScientific: true,
      })}$`;

    case "la masse":
      return `Utiliser la formule de l'énergie cinétique, $E_c=\\frac{1}{2}m \\times v^2$:
1. Convertir les $${EnergyUnit.kJ.toTex()}$ en $${EnergyUnit.J.toTex()}$, $${kineticEnergyMeasure.toTex(
        {
          notScientific: true,
        },
      )}\\Rightarrow ${kineticEnergyJ.toTex({ notScientific: true })}$ 
2. $m=\\frac{2E_c}{v^2} \\Rightarrow m=\\frac{2 \\times ${kineticEnergyJ.toTex({
        hideUnit: true,
        notScientific: true,
      })}}{${velocityMeasure.toTex({
        notScientific: true,
        hideUnit: true,
      })}^2}\\ \\Rightarrow m=${massMeasure.toTex({
        notScientific: true,
      })}$`;

    case "la vitesse":
      return `Utiliser la formule de l'énergie cinétique, $E_c=\\frac{1}{2}m \\times v^2$:
1. Convertir les $${EnergyUnit.kJ.toTex()}$ en $${EnergyUnit.J.toTex()}$, $${kineticEnergyMeasure.toTex(
        {
          notScientific: true,
        },
      )}\\Rightarrow ${kineticEnergyJ.toTex({ notScientific: true })}$ 
2. $v=\\sqrt{\\frac{2E_c}{m}} \\Rightarrow v=\\sqrt{\\frac{2 \\times ${kineticEnergyJ.toTex(
        {
          hideUnit: true,
          notScientific: true,
        },
      )}}{${massMeasure.toTex({
        hideUnit: true,
        notScientific: true,
      })}}}\\ \\Rightarrow v=${velocityMeasure.toTex({
        notScientific: true,
      })}$`;
  }
};

export const kineticEnergyOrMassOrSpeed: Exercise<Identifiers> = {
  id: "kineticEnergyOrMassOrSpeed",
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
  hasHintAndCorrection: true,
};
