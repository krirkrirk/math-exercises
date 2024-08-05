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

type Identifiers = {
  eComb: number;
  quantity: number;
};

const getCombustionTransferEnergyQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex(),
    instruction: exo.instruction,
    hint: exo.hint,
    correction: exo.correction,
    keys: [],
    answerFormat: "tex",
    identifiers: { eComb: exo.eComb, quantity: exo.quantity },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, eComb, quantity },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(eComb, quantity).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  while (propositions.length < n) {
    let random = new Measure(
      -randint(60, 91) * randint(2, 9, [quantity]) * 1000,
      0,
      EnergyUnit.J,
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, eComb, quantity }) => {
  const q = eComb * quantity * 1000;
  const qMeasure = new Measure(q, 0);
  return [answer, q + "", qMeasure.toTex()].includes(ans);
};

const generatePropositions = (eComb: number, quantity: number): Measure[] => {
  const eCombMeasure = new Measure(
    eComb,
    0,
    new DivideUnit(EnergyUnit.kJ, AmountOfSubstance.mol),
  );
  const quantityMeasure = new Measure(quantity, 0, AmountOfSubstance.mol);
  const first = eCombMeasure.times(quantityMeasure);
  const second = new Measure(
    -randint(60, 91) * randint(2, 9, [quantity]) * 1000,
    0,
    EnergyUnit.kJ,
  );
  return [first, second];
};

const generateExercise = () => {
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

  const instruction = `Un échantillon d'un combustible $X$ de $${quantity}$ moles est brûlé complètement. L'énergie molaire de combustion du méthane est $E_{comb} = ${eCombMeasure.toTex(
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

export const combustionTransferEnergy: Exercise<Identifiers> = {
  id: "combustionTransferEnergy",
  label: "Calcul de l'énergie de combustion",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Réaction chimique"],
  generator: (nb: number) =>
    getDistinctQuestions(getCombustionTransferEnergyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
