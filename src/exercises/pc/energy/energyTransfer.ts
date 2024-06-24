import { frenchify } from "#root/math/utils/latex/frenchify";
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
import { round } from "#root/math/utils/round";
import { requiresApostropheBefore } from "#root/utils/requiresApostropheBefore";

type Identifiers = {
  substance: string;
  mass: number;
  latentHeat: number;
  energy: number;
};

const substances = [
  { name: "eau", latentHeat: 334 }, // kJ/kg for melting ice
  { name: "fer", latentHeat: 276 }, // kJ/kg for melting iron
  { name: "aluminium", latentHeat: 397 }, // kJ/kg for melting aluminium
  { name: "or", latentHeat: 64 }, // kJ/kg for melting gold
  { name: "argent", latentHeat: 105 }, // kJ/kg for melting silver
  { name: "plomb", latentHeat: 24 }, // kJ/kg for melting lead
  { name: "cuivre", latentHeat: 207 }, // kJ/kg for melting copper
  { name: "zinc", latentHeat: 112 }, // kJ/kg for melting zinc
  { name: "étain", latentHeat: 60 }, // kJ/kg for melting tin
  { name: "nickel", latentHeat: 297 }, // kJ/kg for melting nickel
];

const getEnergyTransferQuestion: QuestionGenerator<Identifiers> = () => {
  const substance = substances[Math.floor(Math.random() * substances.length)];
  const mass = round(randfloat(0.1, 10), 2); // Mass in kilograms
  const latentHeat = substance.latentHeat; // Latent heat in kJ/kg

  const energy = round(mass * latentHeat, 2);

  const instruction = `Un échantillon de $${frenchify(mass)}\\ kg$ ${
    requiresApostropheBefore(substance.name) ? "d'" : "de "
  }${substance.name} subit un changement d'état. La chaleur latente ${
    requiresApostropheBefore(substance.name) ? "d'" : "de "
  }${substance.name} est de $${latentHeat}\\ kJ/kg$.
  Calculer l'énergie transférée lors du changement d'état en $\\ kJ$`;

  const question: Question<Identifiers> = {
    answer: `${energy}\\ kJ`,
    instruction,
    keys: ["kJ"],
    answerFormat: "tex",
    identifiers: { substance: substance.name, mass, latentHeat, energy },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, substance, mass, latentHeat, energy },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongEnergy = round(energy + randfloat(-50, 50), 2);
    tryToAddWrongProp(propositions, `${wrongEnergy}\\ kJ`);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, energy }) => {
  const validanswer1 = `${energy}\\ kJ`;
  const validanswer2 = energy.toTree().toAllValidTexs();

  let latexs = [];
  latexs.push(validanswer1, ...validanswer2);

  return latexs.includes(ans);
};

export const energyTransfer: Exercise<Identifiers> = {
  id: "energyTransfer",
  label: "Calculer l'énergie transférée lors d'un changement d'état",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Constitution et transformations de la matière"],
  generator: (nb: number) =>
    getDistinctQuestions(getEnergyTransferQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
