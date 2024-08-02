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
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { coulombConstant } from "#root/pc/constants/coulomb";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { ElectricChargeUnit } from "#root/pc/units/electricChargeUnit";
import { ForceUnit } from "#root/pc/units/forceUnits";

type simplifiedMeasure = { significant: number; exponent: number };

type Identifiers = {
  qA: simplifiedMeasure;
  qB: simplifiedMeasure;
  distance: number;
};

const getElectroStaticForceQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = getExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      qA: exo.qA,
      qB: exo.qB,
      distance: exo.distance,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, qA, qB, distance },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(qA, qB, distance).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  const correctAns = getCorrectAns(
    new Measure(qA.significant, qA.exponent, ElectricChargeUnit.C),
    new Measure(qB.significant, qB.exponent, ElectricChargeUnit.C),
    new Measure(distance, 0),
  );
  let random;
  while (propositions.length < n) {
    random = new Measure(
      randfloat(
        correctAns.significantPart - 1,
        correctAns.significantPart + 2,
        2,
        [correctAns.significantPart],
      ),
      correctAns.exponent,
      ForceUnit.N,
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (
  qA: simplifiedMeasure,
  qB: simplifiedMeasure,
  distance: number,
): Measure[] => {
  const qAMeasure = new Measure(
    qA.significant,
    qA.exponent,
    ElectricChargeUnit.C,
  );
  const qBMeasure = new Measure(
    qB.significant,
    qB.exponent,
    ElectricChargeUnit.C,
  );
  const dMeasure = new Measure(distance, 0, DistanceUnit.m);
  const first = qAMeasure.times(qBMeasure).divide(dMeasure.times(dMeasure));
  const second = coulombConstant
    .times(qAMeasure)
    .times(qBMeasure)
    .divide(dMeasure);

  return [first.toSignificant(2), second.toSignificant(2)];
};

const getExercise = () => {
  const qA = { significant: randint(2, 7), exponent: randint(-9, -4) };
  const qB = {
    significant: randint(2, 7, [qA.significant]),
    exponent: randint(-9, -4),
  };
  const qAMeasure = new Measure(
    qA.significant,
    qA.exponent,
    ElectricChargeUnit.C,
  );
  const qBMeasure = new Measure(
    qB.significant,
    qB.exponent,
    ElectricChargeUnit.C,
  );
  const distance = randfloat(0, 1, 1);
  const dMeasure = new Measure(distance, 0, DistanceUnit.m);
  const instruction = `Deux charges ponctuelles, $q_A$ et $q_B$,sont placées dans le vide à une distance $d$ l'une de l'autre.
  
  Données:
  - La charge de $A$ est $q_A=${qAMeasure.toTex()}$
  - La charge de $B$ est $q_B=${qBMeasure.toTex()}$
  - La distance entre les deux charges est $d=${dMeasure.toTex({
    notScientific: true,
  })}$
  
  Cacluler la force électrostatique $\\overrightarrow{F}_{A/B}$.`;

  const answer = getCorrectAns(qAMeasure, qBMeasure, dMeasure);

  return {
    instruction,
    answer,
    qA,
    qB,
    distance,
  };
};

const getCorrectAns = (
  qA: Measure,
  qB: Measure,
  distance: Measure,
): Measure => {
  return coulombConstant
    .times(qA)
    .times(qB)
    .divide(distance.times(distance))
    .toSignificant(2);
};

export const electroStaticForce: Exercise<Identifiers> = {
  id: "electroStaticForce",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getElectroStaticForceQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
