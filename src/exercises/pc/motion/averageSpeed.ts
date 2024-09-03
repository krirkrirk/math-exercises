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
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit, distanceUnits } from "#root/pc/units/distanceUnits";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { TimeUnit, timeValues } from "#root/pc/units/timeUnits";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { random } from "#root/utils/random";
import { time } from "console";

type Identifiers = {
  distance: measure;
  time: measure;
};

type measure = { value: number; unitIndex: number };

const timeUnits = [TimeUnit.h, TimeUnit.mi];
const distanceUnitValues = [DistanceUnit.km, DistanceUnit.m];

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

  const distanceMeasure = new Measure(
    distance.value,
    0,
    distanceUnitValues[distance.unitIndex],
  );
  const timeMeasure = new Measure(time.value, 0, timeUnits[time.unitIndex]);

  genearatePropositions(distanceMeasure, timeMeasure).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  const division = distanceMeasure
    .convert("m")
    .divide(timeMeasure.convert("s"));
  const divisionValue = division.significantPart * division.exponent;
  while (propositions.length < n) {
    let random = randfloat(divisionValue - 10, divisionValue + 11);
    tryToAddWrongProp(
      propositions,
      new Measure(random, 0, division.getUnit()).toSignificant(2).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const genearatePropositions = (
  distance: Measure<distanceUnits>,
  time: Measure<timeValues>,
): string[] => {
  const distanceInMeter = distance.convert("m");
  const timeInSeconds = time.convert("s");
  return [
    distanceInMeter.times(timeInSeconds).toSignificant(2).toTex(),
    distanceInMeter.divide(time).toSignificant(2).toTex(),
    distance.divide(timeInSeconds).toSignificant(2).toTex(),
    distance.divide(time).toSignificant(2).toTex(),
  ];
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, distance, time }) => {
  const distanceMeasure = new Measure(
    distance.value,
    0,
    distanceUnitValues[distance.unitIndex],
  ).convert("m");
  const timeMeasure = new Measure(
    time.value,
    0,
    timeUnits[time.unitIndex],
  ).convert("s");
  return [
    answer,
    distanceMeasure
      .divide(timeMeasure)
      .toSignificant(2)
      .toTex({ hideUnit: true }),
  ].includes(ans);
};

const generateExercise = () => {
  const distance = { value: randint(70, 151), unitIndex: randint(0, 2) };
  const time = { value: randint(10, 61), unitIndex: randint(0, 2) };
  const distanceMeasure = new Measure(
    distance.value,
    0,
    distanceUnitValues[distance.unitIndex],
  );
  const timeMeasure = new Measure(time.value, 0, timeUnits[time.unitIndex]);
  const instruction = `Soit un objet parcourant $${distanceMeasure.toTex({
    notScientific: true,
  })}$ en $${timeMeasure.toTex({ notScientific: true })}$. \n \\
  Caculer la vitesse moyenne de cet objet en $${DistanceUnit.m.toTex()} \\cdot ${TimeUnit.s.toTex()}^{-1}$.
  `;

  const answer = distanceMeasure
    .convert("m")
    .divide(timeMeasure.convert("s"))
    .toSignificant(2);

  const correction = getCorrection(distance, time);
  return {
    instruction,
    answer,
    distance,
    time,
    correction,
  };
};

const getCorrection = (distance: measure, time: measure): string => {
  let correction = ``;
  let step = 1;
  const distanceMeasure = new Measure(
    distance.value,
    0,
    distanceUnitValues[distance.unitIndex],
  ).convert("m");
  const timeMeasure = new Measure(
    time.value,
    0,
    timeUnits[time.unitIndex],
  ).convert("s");
  const calcul = new FractionNode(
    new VariableNode(distanceMeasure.toSignificant(2).toTex()),
    new VariableNode(timeMeasure.toSignificant(2).toTex()),
  );
  const answer = distanceMeasure.divide(timeMeasure).toSignificant(2).toTex();
  if (distance.unitIndex === 0)
    correction = `${step++}. Convertir les $km$ en $m$ : $1km=1000m$.`;
  switch (time.unitIndex) {
    case 0:
      correction = `${correction}
${step++}. Convertir les heures en secondes : $1h = 3600s$.`;
      break;
    case 1:
      correction = `${correction}
${step++}. Convertir les minutes en secondes : $1m = 60s$.`;
  }
  return `${correction}
${step}. Appliquer la règle de calcul pour la vitesse moyenne : $${calcul.toTex()} = ${answer}$`;
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
