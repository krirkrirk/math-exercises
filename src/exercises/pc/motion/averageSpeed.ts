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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { random } from "#root/utils/random";

type Identifiers = {
  distance: { value: number; unit: string };
  time: { value: number; unit: string };
};

const getAverageSpeedQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    keys: [],
    hint: "Rappel : vitesse moyenne = $\\frac{distance}{temps}$",
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

const genearatePropositions = (
  distance: { value: number; unit: string },
  time: { value: number; unit: string },
): string[] => {
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

  return {
    instruction,
    answer,
    distance,
    time,
  };
};

const getCorrectAnswer = (
  distance: { value: number; unit: string },
  time: { value: number; unit: string },
): AlgebraicNode => {
  return (getDistanceinMeter(distance) / getTimeInSeconds(time)).toScientific(
    2,
  );
};

const getDistanceinMeter = (distance: {
  value: number;
  unit: string;
}): number => {
  switch (distance.unit) {
    case "m":
      return distance.value;
    case "km":
      return distance.value * 1000;
    default:
      return 0;
  }
};

const getTimeInSeconds = (time: { value: number; unit: string }): number => {
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
export const averageSpeed: Exercise<Identifiers> = {
  id: "averageSpeed",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getAverageSpeedQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
