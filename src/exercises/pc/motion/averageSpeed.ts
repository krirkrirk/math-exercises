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
import { discreteSetKeys } from "#root/exercises/utils/keys/discreteSetKeys";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { random } from "#root/utils/random";

type Identifiers = {
  distance: measure;
  time: measure;
};

type measure = { value: number; unit: string };

const getAverageSpeedQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    keys: [],
    hint: "Rappel : vitesse moyenne = $\\frac{\\text{distance}}{\\text{temps}}$ $m \\cdot s^{-1}$",
    correction: exo.correction,
    answerFormat: "tex",
    identifiers: { distance: exo.distance, time: exo.time },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, distance, time },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  genearatePropositions(distance, time).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  const division = +(getDistanceinMeter(distance) / getTimeInSeconds(time));
  while (propositions.length < n) {
    let random = randfloat(division - 10, division + 11);
    tryToAddWrongProp(propositions, random.toScientific(2).toTex());
  }
  return shuffleProps(propositions, n);
};

const genearatePropositions = (distance: measure, time: measure): string[] => {
  return [
    (getDistanceinMeter(distance) * getTimeInSeconds(time))
      .toScientific(2)
      .toTex(),
    (getDistanceinMeter(distance) / time.value).toScientific(2).toTex(),
    (distance.value / getTimeInSeconds(time)).toScientific(2).toTex(),
    (distance.value / time.value).toScientific(2).toTex(),
  ];
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateExercise = () => {
  const distance = { value: randint(70, 151), unit: random(["km", "m"]) };
  const time = { value: randint(10, 61), unit: random(["h", "s"]) };

  const instruction = `Soit un objet parcourant $${distance.value}$ $${distance.unit}$ en $${time.value}$ $${time.unit}$. \n \\
  Caculer la vitesse moyenne de cet objet en $m \\cdot s^{-1}$.
  `;

  const answer = getCorrectAnswer(distance, time);

  const correction = getCorrection(distance, time);
  return {
    instruction,
    answer,
    distance,
    time,
    correction,
  };
};

const getCorrectAnswer = (distance: measure, time: measure): AlgebraicNode => {
  return (getDistanceinMeter(distance) / getTimeInSeconds(time)).toScientific(
    2,
  );
};

const getDistanceinMeter = (distance: measure): number => {
  switch (distance.unit) {
    case "m":
      return distance.value;
    case "km":
      return distance.value * 1000;
    default:
      return 0;
  }
};

const getTimeInSeconds = (time: measure): number => {
  switch (time.unit) {
    case "s":
      return time.value;
    case "m":
      return time.value * 60;
    case "h":
      return time.value * 3600;
    default:
      return 0;
  }
};

const getCorrection = (distance: measure, time: measure): string => {
  let correction = ``;
  let step = 1;
  const calcul = new FractionNode(
    getDistanceinMeter(distance).toScientific(2),
    getTimeInSeconds(time).toScientific(2),
  );
  const answer = (getDistanceinMeter(distance) / getTimeInSeconds(time))
    .toScientific(2)
    .toTex();
  if (distance.unit === "km")
    correction = `${step++} - Convertir les $km$ en $m$ : $1km=1000m$.`;
  switch (time.unit) {
    case "h":
      correction = `${correction} \n \\
      ${step++} - Convertir les heures en secondes : $1h = 3600s$.`;
      break;
    case "m":
      correction = `${correction} \n \\
      ${step++} - Convertir les minutes en secondes : $1m = 60s$.`;
  }
  return `${correction} \n \\
  ${step} - Appliquer la règle de calcul pour la vitesse moyenne : $${calcul.toTex()} = ${answer}$ $m \\cdot s^{-1}$`;
};
export const averageSpeed: Exercise<Identifiers> = {
  id: "averageSpeed",
  label: "Caclul de vitesse moyenne",
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
