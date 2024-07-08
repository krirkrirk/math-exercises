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
    { name: "vitesse moyenne", value: speed, unit: " km/h", symbol: "v" },
    { name: "distance", value: distance, unit: " km", symbol: "d" },
    { name: "temps", value: deltaTime, unit: " h", symbol: "t" },
  ];

  const randomIndex = randint(0, variables.length - 1);
  const targetVariable = variables[randomIndex];
  const knownVariables = variables.filter((_, index) => index !== randomIndex);

  const instruction = `Lors d'une mission d'entraînement, un avion de chasse Rafale a été chronométré et mesuré. Voici les données recueillies :
  - ${
    knownVariables[0].name.charAt(0).toUpperCase() +
    knownVariables[0].name.slice(1)
  } : $${knownVariables[0].symbol} = ${round(knownVariables[0].value, 2)
    .toTree()
    .toTex()}${knownVariables[0].unit}$
  - ${
    knownVariables[1].name.charAt(0).toUpperCase() +
    knownVariables[1].name.slice(1)
  } : $${knownVariables[1].symbol} = ${round(knownVariables[1].value, 2)
    .toTree()
    .toTex()}${knownVariables[1].unit}$. \n
  Utilisez ces informations pour calculer ${
    targetVariable.name === "distance" ? "la" : "le"
  } ${targetVariable.name}.`;

  const hint =
    targetVariable.name === "vitesse moyenne"
      ? `Rappelez-vous la formule de la vitesse moyenne : $v = \\frac{d}{t}$.`
      : targetVariable.name === "distance"
      ? `Rappelez-vous la formule de la distance : $d = v \\times t$.`
      : `Rappelez-vous la formule du temps : $t = \\frac{d}{v}$.`;

  const correction =
    targetVariable.name === "vitesse moyenne"
      ? `La vitesse moyenne est calculée en utilisant la formule $v = \\frac{d}{t}$. Donc, $v = \\frac{${round(
          distance,
          2,
        )
          .toTree()
          .toTex()}}{${round(deltaTime, 2).toTree().toTex()}} = ${round(
          speed,
          2,
        )
          .toTree()
          .toTex()}\\ km/h$.`
      : targetVariable.name === "distance"
      ? `La distance est calculée en utilisant la formule $d = v \\times t$. Donc, $d = ${round(
          speed,
          2,
        )
          .toTree()
          .toTex()} \\times ${round(deltaTime, 2).toTree().toTex()} = ${round(
          distance,
          2,
        )
          .toTree()
          .toTex()}\\ km$.`
      : `Le temps est calculé en utilisant la formule $t = \\frac{d}{v}$. Donc, $t = \\frac{${round(
          distance,
          2,
        )
          .toTree()
          .toTex()}}{${round(speed, 2).toTree().toTex()}} = ${round(
          deltaTime,
          2,
        )
          .toTree()
          .toTex()}\\ h$.`;

  const question: Question<Identifiers> = {
    answer: round(targetVariable.value, 2).toTree().toTex(),
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

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
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
