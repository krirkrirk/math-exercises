import { frenchify } from "#root/math/utils/latex/frenchify";
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
import { round } from "#root/math/utils/round";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { TimeUnit } from "#root/pc/units/timeUnits";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { Measure } from "#root/pc/measure/measure";

type Identifiers = {
  speed: number;
  distance: number;
  deltaTime: number;
  target: "vitesse moyenne" | "distance" | "temps";
};

const getAverageSpeedQuestion: QuestionGenerator<Identifiers> = () => {
  const speed = round(randfloat(900, 1400), 2); // Vitesse en km/h
  const distance = round(randfloat(100, 2000), 2); // Distance en km
  const deltaTime = round(distance / speed, 2); // Temps en heures

  const variables = [
    {
      name: "vitesse moyenne",
      value: new Measure(speed, 0, new DivideUnit(DistanceUnit.km, TimeUnit.h)),
      symbol: "v",
    },
    {
      name: "distance",
      value: new Measure(distance, 0, DistanceUnit.km),
      symbol: "d",
    },
    {
      name: "temps",
      value: new Measure(deltaTime, 0, TimeUnit.h),
      symbol: "\\Delta t",
    },
  ];

  const randomIndex = randint(0, variables.length);
  const targetVariable = variables[randomIndex];
  const knownVariables = variables.filter((_, index) => index !== randomIndex);

  const instruction = `Lors d'une mission d'entraînement, un avion de chasse Rafale a été chronométré et mesuré. Voici les données recueillies :
  - ${
    knownVariables[0].name.charAt(0).toUpperCase() +
    knownVariables[0].name.slice(1)
  } : $${knownVariables[0].symbol} = ${knownVariables[0].value.toTex({
    notScientific: true,
  })}$
  - ${
    knownVariables[1].name.charAt(0).toUpperCase() +
    knownVariables[1].name.slice(1)
  } : $${knownVariables[1].symbol} = ${knownVariables[1].value.toTex({
    notScientific: true,
  })}$. \n
  Utilisez ces informations pour calculer ${
    targetVariable.name === "distance" ||
    targetVariable.name === "vitesse moyenne"
      ? "la"
      : "le"
  } ${targetVariable.name} en $${targetVariable.value.getUnit().toTex()}$.`;

  const hint =
    targetVariable.name === "vitesse moyenne"
      ? `Rappelez-vous la formule de la vitesse moyenne : $v = \\frac{d}{\\Delta t}$.`
      : targetVariable.name === "distance"
      ? `Rappelez-vous la formule de la distance : $d = v \\times \\Delta t$.`
      : `Rappelez-vous la formule du temps : $\\Delta t = \\frac{d}{v}$.`;

  const correction =
    targetVariable.name === "vitesse moyenne"
      ? `La vitesse moyenne est calculée en utilisant la formule $v = \\frac{d}{\\Delta t}$. Donc, $v = \\frac{${round(
          distance,
          2,
        )
          .toTree()
          .toTex()}}{${round(deltaTime, 2).toTree().toTex()}} = ${new Measure(
          round(distance / deltaTime, 2),
          0,
          targetVariable.value.getUnit(),
        ).toTex({ notScientific: true })}$.`
      : targetVariable.name === "distance"
      ? `La distance est calculée en utilisant la formule $d = v \\times \\Delta t$. Donc, $d = ${round(
          speed,
          2,
        )
          .toTree()
          .toTex()} \\times ${round(deltaTime, 2)
          .toTree()
          .toTex()} = ${new Measure(
          round(speed * deltaTime, 2),
          0,
          DistanceUnit.km,
        ).toTex({ notScientific: true })}$.`
      : `Le temps est calculé en utilisant la formule $\\Delta t = \\frac{d}{v}$. Donc, $t = \\frac{${round(
          distance,
          2,
        )
          .toTree()
          .toTex()}}{${round(speed, 2).toTree().toTex()}} = ${new Measure(
          round(distance / speed, 2),
          0,
          TimeUnit.h,
        ).toTex({ notScientific: true })}$.`;

  const question: Question<Identifiers> = {
    answer: getCorrectAns(
      targetVariable.name,
      speed,
      distance,
      deltaTime,
    ).toTex({
      notScientific: true,
      hideUnit: true,
    }),
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      speed,
      distance,
      deltaTime,
      target: targetVariable.name as "vitesse moyenne" | "distance" | "temps",
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, speed, distance, deltaTime, target },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  if (target === "vitesse moyenne") {
    tryToAddWrongProp(
      propositions,
      round(speed * randfloat(0.5, 1.5), 2)
        .toTree()
        .toTex(),
      "tex",
    );
    tryToAddWrongProp(
      propositions,
      round(speed / randfloat(0.5, 1.5), 2)
        .toTree()
        .toTex(),
      "tex",
    );
  } else if (target === "distance") {
    tryToAddWrongProp(
      propositions,
      round(distance * randfloat(0.5, 1.5), 2)
        .toTree()
        .toTex(),
      "tex",
    );
    tryToAddWrongProp(
      propositions,
      round(distance / randfloat(0.5, 1.5), 2)
        .toTree()
        .toTex(),
      "tex",
    );
  } else if (target === "temps") {
    tryToAddWrongProp(
      propositions,
      round(deltaTime * randfloat(0.5, 1.5), 2)
        .toTree()
        .toTex(),
      "tex",
    );
    tryToAddWrongProp(
      propositions,
      round(deltaTime / randfloat(0.5, 1.5), 2)
        .toTree()
        .toTex(),
      "tex",
    );
  }

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(100, 2000, 2).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const getCorrectAns = (
  targetVariable: string,
  speed: number,
  distance: number,
  deltaTime: number,
): Measure => {
  switch (targetVariable) {
    case "distance":
      return new Measure(round(speed * deltaTime, 2), 0, DistanceUnit.km);
    case "vitesse moyenne":
      return new Measure(
        round(distance / deltaTime, 2),
        0,
        new DivideUnit(DistanceUnit.km, TimeUnit.h),
      );
    case "temps":
      return new Measure(round(distance / speed, 2), 0, TimeUnit.h);
  }
  return new Measure(0);
};

export const AverageSpeedCalculationExercise: Exercise<Identifiers> = {
  id: "averageSpeedCalculation",
  label:
    "Calculer la vitesse moyenne, la distance ou le temps d'un objet en mouvement",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Mécanique"],
  generator: (nb: number) => getDistinctQuestions(getAverageSpeedQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
