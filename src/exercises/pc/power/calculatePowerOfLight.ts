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
import { randint } from "#root/math/utils/random/randint";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit } from "#root/pc/units/distanceUnits";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { PowerUnit } from "#root/pc/units/powerUnits";
import { WattUnit } from "#root/pc/units/wattUnit";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {
  E: number;
  S: number;
};
const two = new NumberNode(2);

const getCalculatePowerOfLightQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = getExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    keys: [],
    hint: exo.hint,
    correction: exo.correction,
    answerFormat: "tex",
    identifiers: {
      E: exo.E.significantPart * Math.pow(10, exo.E.exponent),
      S: exo.S.significantPart * Math.pow(10, exo.S.exponent),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, E, S }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + `\\ ${WattUnit.W.toTex()}`);
  generatePropositions(E, S).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex({ notScientific: true })),
  );
  let random;
  while (propositions.length < n) {
    random = randint(E * S - 10, E * S + 10, [E]);
    tryToAddWrongProp(
      propositions,
      new Measure(random, 0, WattUnit.W).toTex({ notScientific: true }),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (E: number, S: number): Measure[] => {
  const first = new Measure(Math.floor(E / S), 0, WattUnit.W);
  return [first];
};

const getExercise = () => {
  const E = new Measure(
    randint(10, 30),
    0,
    new DivideUnit(WattUnit.W, new PowerUnit(DistanceUnit.m, two)),
  );
  const S = new Measure(randint(3, 11), 0, new PowerUnit(DistanceUnit.m, two));
  const lightPower = E.times(S).toSignificant(2);

  const instruction = `Une cellule photovoltaïque est exposée à une lumière dont l'éclairement $E$ est de $${E.toTex(
    { notScientific: true },
  )}$.\n \\
  La surface utile $S$ de cette cellule est de $${S.toTex({
    notScientific: true,
  })}$. Calculez la puissance lumineuse reçue par la cellule photovoltaïque. $${lightPower.toTex(
    { notScientific: true },
  )}$`;

  const hint = `Rappel : La puissance lumineuse reçue $P$, exprimée en $${WattUnit.W.toTex()}$, est donnée par la formule :
- $P=E \\cdot S$
`;

  const correction = `En appliquant la formule $P=E \\cdot S$ on obtient : 
- $P=${E.toTex({ notScientific: true })} \\times ${S.toTex({
    notScientific: true,
  })}\\ \\Rightarrow  P=${lightPower.toTex({ notScientific: true })}$`;

  return {
    instruction,
    answer: lightPower.toTex({ hideUnit: true, notScientific: true }),
    hint,
    correction,
    E,
    S,
    lightPower,
  };
};
export const calculatePowerOfLight: Exercise<Identifiers> = {
  id: "calculatePowerOfLight",
  label: "Calcul de puissance lumineuse.",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Lumière"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculatePowerOfLightQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  hasHintAndCorrection: true,
};
