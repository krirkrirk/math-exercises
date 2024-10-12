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
import { roundSignificant } from "#root/math/utils/round";
import { random } from "#root/utils/alea/random";
import { requiresApostropheBefore } from "#root/utils/strings/requiresApostropheBefore";

const combustibles = [
  { name: "bois", value: 15 },
  { name: "éthanol", value: 29 },
  { name: "butane", value: 46.4 },
  { name: "heptane", value: 44.6 },
  { name: "gazole", value: 45 },
  { name: "méthane", value: 50 },
];

type Identifiers = { combustibleName: string; combustibleQuantity: number };

const getCalculateCombustionEnergyQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const combustibleQuantity = randint(100, 301);
  const combustible = random(combustibles);

  const instruction = `Calculer l'énergie libérée lors de la combustion de $${combustibleQuantity}\\ \\text{g}$ ${
    requiresApostropheBefore(combustible.name) ? "d'" : "de"
  } ${combustible.name} (en $\\text{MJ}$). 
  $\\newline$
  Données : $\\text{PC(${
    combustible.name
  })} = ${combustible.value.frenchify()}\\ \\text{MJ}\\cdot\\text{kg}^{-1}$`;

  const energy = roundSignificant(
    -combustibleQuantity * 0.001 * combustible.value,
    1,
  );

  const question: Question<Identifiers> = {
    answer: energy,
    instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { combustibleName: combustible.name, combustibleQuantity },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, combustibleName, combustibleQuantity },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const combustible = combustibles.find((c) => c.name === combustibleName)!;
  const noNegative = roundSignificant(
    combustibleQuantity * 0.001 * combustible.value,
    1,
  );
  const noConversion = roundSignificant(
    -combustibleQuantity * combustible.value,
    1,
  );
  const noNegativeNoConversion = roundSignificant(
    combustibleQuantity * combustible.value,
    1,
  );
  tryToAddWrongProp(propositions, `${noNegative}`);
  tryToAddWrongProp(propositions, `${noConversion}`);
  tryToAddWrongProp(propositions, `${noNegativeNoConversion}`);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, `${randint(0, 10)}`);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  // throw Error("VEA not implemented");
  return ans === answer;
};
export const calculateCombustionEnergy: Exercise<Identifiers> = {
  id: "calculateCombustionEnergy",
  label: "Calculer l'énergie libérée par combustion",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Chimie des solutions"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateCombustionEnergyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
