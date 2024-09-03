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
  inputPower: number;
  outputPower: number;
  efficiency: number;
  variable: "P_in" | "P_out" | "η";
};

const getEfficiencyCalculationQuestion: QuestionGenerator<Identifiers> = () => {
  const inputPower = round(randfloat(100, 1000), 2); // Puissance d'entrée en W
  const outputPower = round(randfloat(50, 900), 2); // Puissance de sortie en W
  const efficiency = round(outputPower / inputPower, 2); // Rendement

  const variableIndex = randint(0, 3);
  const variables = ["P_in", "P_out", "η"] as const;
  const variable = variables[variableIndex];

  let questionText, answer;
  switch (variable) {
    case "P_in":
      questionText = `Vous êtes dans un laboratoire et vous mesurez l'efficacité d'un convertisseur. La puissance de sortie est $P_{out} = ${frenchify(
        outputPower,
      )}\\ \\text{W}$ et le rendement est $\\eta = ${frenchify(
        efficiency,
      )}$. Déterminez la puissance d'entrée $P_{in}$ en $\\text{W}$.`;
      answer = round(outputPower / efficiency, 2);
      break;
    case "P_out":
      questionText = `Vous êtes dans un laboratoire et vous mesurez l'efficacité d'un convertisseur. La puissance d'entrée est $P_{in} = ${frenchify(
        inputPower,
      )}\\ \\text{W}$ et le rendement est $\\eta = ${frenchify(
        efficiency,
      )}$. Déterminez la puissance de sortie $P_{out}$ en $\\text{W}$.`;
      answer = round(inputPower * efficiency, 2);
      break;
    case "η":
      questionText = `Vous êtes dans un laboratoire et vous mesurez l'efficacité d'un convertisseur. La puissance d'entrée est $P_{in} = ${frenchify(
        inputPower,
      )}\\ \\text{W}$ et la puissance de sortie est $P_{out} = ${frenchify(
        outputPower,
      )}\\ \\text{W}$. Déterminez le rendement $\\eta$.`;
      answer = round(outputPower / inputPower, 2);
      break;
  }

  const hint = `Le rendement d'un convertisseur, noté $\\eta$, est une grandeur sans dimension qui mesure l'efficacité de sa conversion. Il est défini par la relation :
    $$
    \\eta = \\frac{P_{out}}{P_{in}}
    $$
    Réarrangez cette formule pour isoler la variable à trouver.`;

  const correction = `La formule du rendement est :
    $$
    \\eta = \\frac{P_{out}}{P_{in}}
    $$

Pour résoudre ce problème, nous devons réorganiser la formule pour isoler la variable inconnue.

${
  variable === "P_in"
    ? `$$P_{in} = \\frac{P_{out}}{\\eta} = \\frac{${frenchify(
        outputPower,
      )}}{${frenchify(efficiency)}} = ${frenchify(answer)}\\ \\text{W}$$`
    : variable === "P_out"
    ? `$$P_{out} = \\eta \\times P_{in} = ${frenchify(
        efficiency,
      )} \\times ${frenchify(inputPower)} = ${frenchify(answer)}\\ \\text{W}$$`
    : `$$\\eta = \\frac{P_{out}}{P_{in}} = \\frac{${frenchify(
        outputPower,
      )}}{${frenchify(inputPower)}} = ${frenchify(answer)}$$`
}`;

  const question: Question<Identifiers> = {
    answer: answer.toTree().toTex(),
    instruction: questionText,
    hint,
    correction,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: {
      inputPower,
      outputPower,
      efficiency,
      variable,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, inputPower, outputPower, efficiency, variable },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongAnswers = [
    variable === "P_in"
      ? round(outputPower * efficiency, 2)
      : round(outputPower / efficiency, 2),
    variable === "P_out"
      ? round(inputPower / efficiency, 2)
      : round(inputPower * efficiency, 2),
    variable === "η"
      ? round(inputPower / outputPower, 2)
      : round(outputPower / inputPower, 2),
  ];

  wrongAnswers.forEach((wrongAnswer) => {
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  });

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(0.1, 1, 2).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, outputPower, inputPower, variable },
) => {
  let validanswer;
  const efficiency = round(outputPower / inputPower, 2);
  switch (variable) {
    case "P_in":
      validanswer = round(outputPower / efficiency, 2);
      break;
    case "P_out":
      validanswer = round(inputPower * efficiency, 2);
      break;
    case "η":
      validanswer = round(outputPower / inputPower, 2);
      break;
  }

  const latexs = [
    ...validanswer.toTree().toAllValidTexs(),
    validanswer.toScientific(2).toTex(),
    validanswer.toScientific(1).toTex(),
    validanswer.toScientific(3).toTex(),
  ];

  return latexs.includes(ans);
};

export const efficiencyCalculation: Exercise<Identifiers> = {
  id: "efficiencyCalculation",
  label: "Calculer les puissances d'entrée/sortie ou le rendement",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Énergie"],
  generator: (nb: number) =>
    getDistinctQuestions(getEfficiencyCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
