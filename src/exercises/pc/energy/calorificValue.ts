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
import { AmountOfSubstance } from "#root/pc/units/AmountOfSubstance";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { EnergyUnit } from "#root/pc/units/energyUnit";
import { MassUnit } from "#root/pc/units/massUnits";

type Identifiers = {
  pc: number;
  mass: number;
};

const getCalorificValueQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    hint: exo.hint,
    correction: exo.correction,
    keys: [],
    answerFormat: "tex",
    identifiers: { pc: exo.pc, mass: exo.mass },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, pc, mass },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(pc, mass).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  while (propositions.length < n) {
    let random = new Measure(
      -randint(60, 91) * randint(2, 9, [mass]) * 1000,
      randint(-2, 3),
      EnergyUnit.J,
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, pc, mass }) => {
  const q = -pc * mass * 1000;
  const qMeasure = new Measure(q, 0);
  return [answer, q + "", qMeasure.toTex()].includes(ans);
};

const generatePropositions = (pc: number, mass: number): Measure[] => {
  const pcMeasure = new Measure(
    pc,
    0,
    new DivideUnit(EnergyUnit.J, MassUnit.kg),
  );
  const massMeasure = new Measure(mass, 0, MassUnit.kg);
  const first = pcMeasure.times(massMeasure).times(-1).toSignificant(6);
  return [first];
};

const generateExercise = () => {
  const pc = randint(60, 91);
  const mass = randint(2, 11);
  const massMeasure = new Measure(mass, 0, MassUnit.kg);
  const pcMeasure = new Measure(
    pc,
    0,
    new DivideUnit(EnergyUnit.kJ, MassUnit.kg),
  );

  const pcMeasureJ = new Measure(
    pc * 1000,
    0,
    new DivideUnit(EnergyUnit.J, MassUnit.kg),
  );

  const instruction = `Un échantillon d'un combustible $X$ de masse $${massMeasure.toTex(
    { notScientific: true },
  )}$ est brûlé complètement. Le pouvoir calorifique de ce combustible est $PC = ${pcMeasure.toTex(
    { notScientific: true },
  )}$.
  
  Calculez l'énergie totale $(Q)$ libérée lors de la combustion de cet échantillon en joules $(J)$.`;

  const answer = massMeasure.times(pcMeasureJ).times(-1).toSignificant(6);

  const hint = `Rappel de la formule pour calculer l'énergie totale $(Q)$ libérée lors de la combustion :
  - $Q = -m \\times PC$`;

  const correction = `Appliquer la formule $Q = -m \\times PC$ :
  1. Convertir les $${EnergyUnit.kJ.toTex()}$ en $${EnergyUnit.J.toTex()}$, $${pcMeasure.toTex(
    { notScientific: true },
  )} \\Rightarrow ${pcMeasureJ.toTex({ notScientific: true })}$
  2. $Q = -${massMeasure.toTex({
    notScientific: true,
  })} \\times ${pcMeasureJ.toTex({ notScientific: true })}$
  3. $Q=${answer.toTex()}$`;

  return { instruction, answer, hint, correction, pc, mass };
};

export const calorificValue: Exercise<Identifiers> = {
  id: "calorificValue",
  label: "Calcul de l'énergie de combustion à l'aide du pouvoir calorifique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Réaction chimique"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalorificValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
