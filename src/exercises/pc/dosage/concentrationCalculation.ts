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
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  concentration: number;
  quantity: number;
  volume: number;
  variable: "C" | "n" | "V";
};

const getConcentrationCalculationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const concentration = round(randfloat(0.1, 2), 2); // Concentration en mol/L
  const quantity = round(randfloat(0.1, 5), 2); // Quantité de matière en mol
  const volume = round(randfloat(0.1, 2), 2); // Volume en L

  const variableIndex = randint(0, 3);
  const variables = ["C", "n", "V"] as const;
  const variable = variables[variableIndex];

  let questionText, answer;
  switch (variable) {
    case "C":
      questionText = `Vous avez une solution contenant une quantité de matière $n = ${frenchify(
        quantity,
      )}\\ \\text{mol}$ dissoute dans un volume $V = ${frenchify(
        volume,
      )}\\ \\text{L}$. Déterminez la concentration $[X_i]$ en $\\text{mol.L}^{-1}$ de cette solution.`;
      answer = round(quantity / volume, 2);
      break;
    case "n":
      questionText = `Vous avez une solution de concentration $[X_i] = ${frenchify(
        concentration,
      )}\\ \\text{mol.L}^{-1}$ dans un volume $V = ${frenchify(
        volume,
      )}\\ \\text{L}$. Déterminez la quantité de matière $n$ en $\\text{mol}$ de cette solution.`;
      answer = round(concentration * volume, 2);
      break;
    case "V":
      questionText = `Vous avez une solution de concentration $[X_i] = ${frenchify(
        concentration,
      )}\\ \\text{mol.L}^{-1}$ contenant une quantité de matière $n = ${frenchify(
        quantity,
      )}\\ \\text{mol}$. Déterminez le volume $V$ en $\\text{L}$ de cette solution.`;
      answer = round(quantity / concentration, 2);
      break;
  }

  const hint = `La concentration en quantité de matière $[X_i]$ d'une espèce chimique en solution est le quotient de la quantité de matière $n$ de soluté par le volume $V_{\\text{solution}}$ de la solution :
    $$
    [X_i] = \\frac{n}{V_{\\text{solution}}}
    $$
    Réarrangez cette formule pour isoler la variable à trouver.`;

  const correction = `La formule de la concentration est :
    $$
    [X_i] = \\frac{n}{V}
    $$
  
Pour résoudre ce problème, nous devons réorganiser la formule pour isoler la variable inconnue.
  
${
  variable === "C"
    ? `$$[X_i] = \\frac{n}{V} = \\frac{${frenchify(quantity)}}{${frenchify(
        volume,
      )}} = ${frenchify(answer)}\\ \\text{mol.L}^{-1}$$`
    : variable === "n"
    ? `$$n = [X_i] \\times V = ${frenchify(concentration)} \\times ${frenchify(
        volume,
      )} = ${frenchify(answer)}\\ \\text{mol}$$`
    : `$$V = \\frac{n}{[X_i]} = \\frac{${frenchify(quantity)}}{${frenchify(
        concentration,
      )}} = ${frenchify(answer)}\\ \\text{L}$$`
}`;

  const question: Question<Identifiers> = {
    answer: answer.toTree().toTex(),
    instruction: questionText,
    hint,
    correction,
    keys: ["C", "n", "V"],
    answerFormat: "tex",
    identifiers: {
      concentration,
      quantity,
      volume,
      variable,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, concentration, quantity, volume, variable },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongAnswers = [
    variable === "C"
      ? round(quantity * volume, 2)
      : round(quantity / volume, 2),
    variable === "n"
      ? round(concentration / volume, 2)
      : round(concentration * volume, 2),
    variable === "V"
      ? round(quantity * concentration, 2)
      : round(quantity / concentration, 2),
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

export const concentrationCalculation: Exercise<Identifiers> = {
  id: "concentrationCalculation",
  label: "Calculer la concentration d'un élément dans une solution",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Chimie des solutions"],
  generator: (nb: number) =>
    getDistinctQuestions(getConcentrationCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
