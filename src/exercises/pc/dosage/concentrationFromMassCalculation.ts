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
import { round } from "#root/math/utils/round";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  concentration: number;
  mass: number;
  molarMass: number;
  variable: "C" | "t" | "M";
};

const getConcentrationFromMassCalculationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const concentration = round(randfloat(0.1, 2), 2); // Concentration en mol/L
  const mass = round(randfloat(0.1, 5), 2); // Concentration en masse en g/L
  const molarMass = round(randfloat(10, 200), 2); // Masse molaire en g/mol

  const variableIndex = randint(0, 3);
  const variables = ["C", "t", "M"] as const;
  const variable = variables[variableIndex];

  let questionText, answer;
  switch (variable) {
    case "C":
      questionText = `Vous avez une solution avec une concentration en masse $t = ${frenchify(
        mass,
      )}\\ \\text{g.L}^{-1}$ et une masse molaire $M = ${frenchify(
        molarMass,
      )}\\ \\text{g.mol}^{-1}$. Déterminez la concentration $C$ en $\\text{mol.L}^{-1}$ de cette solution.`;
      answer = round(mass / molarMass, 2);
      break;
    case "t":
      questionText = `Vous avez une solution avec une concentration $C = ${frenchify(
        concentration,
      )}\\ \\text{mol.L}^{-1}$ et une masse molaire $M = ${frenchify(
        molarMass,
      )}\\ \\text{g.mol}^{-1}$. Déterminez la concentration en masse $t$ en $\\text{g.L}^{-1}$ de cette solution.`;
      answer = round(concentration * molarMass, 2);
      break;
    case "M":
      questionText = `Vous avez une solution avec une concentration en masse $t = ${frenchify(
        mass,
      )}\\ \\text{g.L}^{-1}$ et une concentration $C = ${frenchify(
        concentration,
      )}\\ \\text{mol.L}^{-1}$. Déterminez la masse molaire $M$ en $\\text{g.mol}^{-1}$ de cette solution.`;
      answer = round(mass / concentration, 2);
      break;
  }

  const hint = `La relation entre la concentration en quantité de matière $C$, la concentration en masse $t$, et la masse molaire $M$ est donnée par :
    $$
    C = \\frac{t}{M}
    $$
    Réarrangez cette formule pour isoler la variable à trouver.`;

  const correction = `La relation entre la concentration en quantité de matière, la concentration en masse et la masse molaire est :
    $$
    C = \\frac{t}{M}
    $$
  
Pour résoudre ce problème, nous devons réorganiser la formule pour isoler la variable inconnue.
  
${
  variable === "C"
    ? `$$C = \\frac{t}{M} = \\frac{${frenchify(mass)}}{${frenchify(
        molarMass,
      )}} = ${frenchify(answer)}\\ \\text{mol.L}^{-1}$$`
    : variable === "t"
    ? `$$t = C \\times M = ${frenchify(concentration)} \\times ${frenchify(
        molarMass,
      )} = ${frenchify(answer)}\\ \\text{g.L}^{-1}$$`
    : `$$M = \\frac{t}{C} = \\frac{${frenchify(mass)}}{${frenchify(
        concentration,
      )}} = ${frenchify(answer)}\\ \\text{g.mol}^{-1}$$`
}`;

  const question: Question<Identifiers> = {
    answer: answer.toTree().toTex(),
    instruction: questionText,
    hint,
    correction,
    keys: ["C", "t", "M"],
    answerFormat: "tex",
    identifiers: {
      concentration,
      mass,
      molarMass,
      variable,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, concentration, mass, molarMass, variable },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongAnswers = [
    variable === "C" ? round(mass * molarMass, 2) : round(mass / molarMass, 2),
    variable === "t"
      ? round(concentration / molarMass, 2)
      : round(concentration * molarMass, 2),
    variable === "M"
      ? round(mass * concentration, 2)
      : round(mass / concentration, 2),
  ];

  wrongAnswers.forEach((wrongAnswer) => {
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  });

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(0.1, 5, 2).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const concentrationFromMassCalculation: Exercise<Identifiers> = {
  id: "concentrationFromMassCalculation",
  label:
    "Calculer la concentration à partir de la concentration en masse et la masse molaire",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Chimie des solutions"],
  generator: (nb: number) =>
    getDistinctQuestions(getConcentrationFromMassCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
