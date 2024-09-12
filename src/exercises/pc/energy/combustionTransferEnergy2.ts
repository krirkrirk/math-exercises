import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
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
  type: number;
  pc?: number;
  mass?: number;
  eComb?: number;
  quantity?: number;
};

type ExoType1 = {
  instruction: string;
  answer: Measure;
  hint: string;
  correction: string;
  pc: number;
  mass: number;
};

type ExoType2 = {
  instruction: string;
  answer: Measure;
  hint: string;
  correction: string;
  eComb: number;
  quantity: number;
};

const getCombustionTransferEnergy2Question: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const identif =
    exo.type === 1
      ? { pc: (exo as ExoType1).pc, mass: (exo as ExoType1).mass }
      : {
          eComb: (exo as ExoType2).eComb,
          quantity: (exo as ExoType2).quantity,
        };
  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    hint: exo.hint,
    correction: exo.correction,
    keys: [],
    answerFormat: "tex",
    identifiers: { type: exo.type, ...identif },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, type, pc, mass, quantity, eComb },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(type, pc, mass, eComb, quantity).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  while (propositions.length < n) {
    let random = new Measure(
      -randint(60, 91) * randint(2, 9) * 1000,
      randint(-2, 3),
      EnergyUnit.J,
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, type, pc, mass, eComb, quantity },
) => {
  const validAns = getValidAnswers(type, pc, mass, eComb, quantity);
  validAns.push(answer);
  return validAns.includes(ans);
};

const getValidAnswers = (
  type: number,
  pc: number = 0,
  mass: number = 0,
  eComb: number = 0,
  quantity: number = 0,
) => {
  let q;
  let qMeasure;
  if (type === 1) {
    q = -pc * mass * 1000;
    qMeasure = new Measure(q, 0);
  } else {
    q = eComb * quantity * 1000;
    qMeasure = new Measure(q, 0);
  }
  return [q + "", qMeasure.toTex()];
};

const generatePropositions = (
  type: number,
  pc?: number,
  mass?: number,
  eComb?: number,
  quantity?: number,
) => {
  return type === 1
    ? generateType1Propositins(pc!, mass!)
    : generateType2Propositins(eComb!, quantity!);
};

const generateType1Propositins = (pc: number, mass: number): Measure[] => {
  const pcMeasure = new Measure(
    pc,
    0,
    new DivideUnit(EnergyUnit.J, MassUnit.kg),
  );
  const massMeasure = new Measure(mass, 0, MassUnit.kg);
  const first = pcMeasure.times(massMeasure).times(-1).toSignificant(6);
  return [first];
};
const generateType2Propositins = (
  eComb: number,
  quantity: number,
): Measure[] => {
  const eCombMeasure = new Measure(
    eComb,
    0,
    new DivideUnit(EnergyUnit.J, AmountOfSubstance.mol),
  );
  const quantityMeasure = new Measure(quantity, 0, AmountOfSubstance.mol);
  const first = eCombMeasure.times(quantityMeasure).toSignificant(6);
  return [first];
};

const generateExercise = () => {
  const type = randint(1, 3);
  const exo = type === 1 ? getExoType1() : getExoType2();
  return { type, ...exo };
};

const getExoType1 = (): ExoType1 => {
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

  return {
    instruction,
    answer,
    hint,
    correction,
    pc,
    mass,
  };
};

const getExoType2 = (): ExoType2 => {
  const eComb = -randint(60, 91);
  const quantity = randint(2, 9);
  const quantityMeasure = new Measure(quantity, 0, AmountOfSubstance.mol);
  const eCombMeasure = new Measure(
    eComb,
    0,
    new DivideUnit(EnergyUnit.kJ, AmountOfSubstance.mol),
  );

  const eCombMeasureJ = new Measure(
    eComb * 1000,
    0,
    new DivideUnit(EnergyUnit.J, AmountOfSubstance.mol),
  );

  const instruction = `Un échantillon d'un combustible $X$ de $${quantity}$ moles est brûlé complètement. L'énergie molaire de combustion de ce combustible est $E_{comb} = ${eCombMeasure.toTex(
    { notScientific: true },
  )}$.
  
  Calculez l'énergie totale $(Q)$ libérée lors de la combustion de cet échantillon en joules $(J)$.`;

  const answer = quantityMeasure.times(eCombMeasureJ).toSignificant(6);

  const hint = `Rappel de la formule pour calculer l'énergie totale $(Q)$ libérée lors de la combustion :
  - $Q = n \\times E_{comb}$`;

  const correction = `Appliquer la formule $Q = n \\times E_{comb}$ :
  1. Convertir les $${EnergyUnit.kJ.toTex()}$ en $${EnergyUnit.J.toTex()}$, $${eCombMeasure.toTex(
    { notScientific: true },
  )} \\Rightarrow ${eCombMeasureJ.toTex({ notScientific: true })}$
  2. $Q = ${quantityMeasure.toTex({
    notScientific: true,
  })} \\times ${eCombMeasure.toTex({ notScientific: true })}$
  3. $Q=${answer.toTex()}$`;

  return { instruction, answer, hint, correction, eComb, quantity };
};
export const combustionTransferEnergy2: Exercise<Identifiers> = {
  id: "combustionTransferEnergy2",
  label:
    "Caclul de l'énergie de transfert de combustion à l'aide du pouvoir calorifique ou de l'énergie de combustion. ",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Réaction chimique"],
  generator: (nb: number) =>
    getDistinctQuestions(getCombustionTransferEnergy2Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  hasHintAndCorrection: true,
};
