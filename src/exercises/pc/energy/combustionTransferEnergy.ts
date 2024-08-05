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
import { countReset } from "console";

type Identifiers = {
  eComb: number;
  quantity: number;
};

const getCombustionTransferEnergyQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer.toTex({ hideUnit: true }),
    instruction: exo.instruction,
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
  const coorectAns = eComb * quantity * 1000;
  while (propositions.length < n) {
    let random = new Measure(
      randint(coorectAns - 50, coorectAns + 50, [coorectAns]),
      0,
      EnergyUnit.J,
    );
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (eComb: number, quantity: number): Measure[] => {
  const eCombMeasure = new Measure(
    eComb,
    0,
    new DivideUnit(EnergyUnit.kJ, AmountOfSubstance.mol),
  );
  const quantityMeasure = new Measure(quantity, 0, AmountOfSubstance.mol);
  const first = eCombMeasure.times(quantityMeasure);
  return [first];
};

const generateExercise = () => {
  const eComb = randint(600, 901);
  const quantity = randint(2, 9);
  const quantityMeasure = new Measure(quantity, 0, AmountOfSubstance.mol);
  const EcombMeasure = new Measure(
    eComb,
    0,
    new DivideUnit(EnergyUnit.kJ, AmountOfSubstance.mol),
  );

  const EcombMeasureJ = new Measure(
    eComb * 1000,
    0,
    new DivideUnit(EnergyUnit.J, AmountOfSubstance.mol),
  );

  const instruction = `Un échantillon d'un combustible $X$ de $${quantity}$ moles est brûlé complètement. L'énergie molaire de combustion du méthane est $E_{comb} = ${EcombMeasure.toTex(
    { notScientific: true },
  )}$`;

  const answer = quantityMeasure.times(EcombMeasureJ);

  return { instruction, answer, eComb, quantity };
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
