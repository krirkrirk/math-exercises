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
import { coulombConstant } from "#root/pc/constants/coulomb";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { ElectricalChargeUnit } from "#root/pc/units/electricalChargeUnit";
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
    hint: exo.hint,
    correction: exo.correction,
    keys: ["N"],
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
    new Measure(qA.significant, qA.exponent, ElectricalChargeUnit.C),
    new Measure(qB.significant, qB.exponent, ElectricalChargeUnit.C),
    new Measure(distance, 0),
  );
  let random;
  while (propositions.length < n) {
    random = new Measure(
      randfloat(1, 5, 1, [correctAns.significantPart]),
      correctAns.exponent,
      ForceUnit.N,
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, qA, qB, distance }) => {
  const correctAns = getCorrectAns(
    new Measure(qA.significant, qA.exponent, ElectricalChargeUnit.C),
    new Measure(qB.significant, qB.exponent, ElectricalChargeUnit.C),
    new Measure(distance, 0, DistanceUnit.m),
  );
  return [
    correctAns.toTex({ hideUnit: true }),
    correctAns.toTex({ hideUnit: true }) + "N",
    answer,
  ].includes(ans);
};

const generatePropositions = (
  qA: simplifiedMeasure,
  qB: simplifiedMeasure,
  distance: number,
): Measure[] => {
  const qAMeasure = new Measure(
    qA.significant,
    qA.exponent,
    ElectricalChargeUnit.C,
  );
  const qBMeasure = new Measure(
    qB.significant,
    qB.exponent,
    ElectricalChargeUnit.C,
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
  const qA = { significant: randint(2, 7), exponent: randint(-7, -3) };
  const qB = {
    significant: randint(2, 7, [qA.significant]),
    exponent: randint(-7, -3),
  };
  const qAMeasure = new Measure(
    qA.significant,
    qA.exponent,
    ElectricalChargeUnit.C,
  );
  const qBMeasure = new Measure(
    qB.significant,
    qB.exponent,
    ElectricalChargeUnit.C,
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
  
  Cacluler la force électrostatique $\\overrightarrow{F}_{A/B}$, arrondie au centième`;

  const answer = getCorrectAns(qAMeasure, qBMeasure, dMeasure);

  const hint = `Rappel de la loi de Coulomb :
  - $F = k_e \\frac{|q_1 \\cdot q_2|}{r^2}$ `;

  const correction = `Appliquer la loi de Coulomb :
1. $F = k_e \\frac{|${qAMeasure.toTex()} \\times ${qBMeasure.toTex()}|}{${dMeasure.toTex(
    { notScientific: true },
  )}^2}$
2. $F = ${answer.toTex()}$`;

  return {
    instruction,
    answer,
    hint,
    correction,
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
  label: "Application de la loi de Coulomb",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Forces"],
  generator: (nb: number) =>
    getDistinctQuestions(getElectroStaticForceQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
