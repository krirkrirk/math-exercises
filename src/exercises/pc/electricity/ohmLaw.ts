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
  voltage: number;
  current: number;
  resistance: number;
  target: string;
  targetValue: number;
};

const getOhmLawQuestion: QuestionGenerator<Identifiers> = () => {
  const resistance = randint(1, 50);
  const current = round(randfloat(0.1, 4, 2), 2);
  const voltage = round(resistance * current, 2);

  const variables = [
    { name: "résistance", value: resistance, unit: " \\ \\Omega", symbol: "R" },
    { name: "courant", value: current, unit: "\\ A", symbol: "I" },
    { name: "tension", value: voltage, unit: "\\ V", symbol: "U" },
  ];

  const randomIndex = randint(0, variables.length);
  const targetVariable = variables[randomIndex];
  const knownVariables = variables.filter((_, index) => index !== randomIndex);

  const instruction = `Lors d'une expérience en classe de physique, vous devez étudier le comportement d'un conducteur ohmique. Vous avez connecté le conducteur à un circuit électrique et mesuré les valeurs suivantes :
  - ${
    knownVariables[0].name.charAt(0).toUpperCase() +
    knownVariables[0].name.slice(1)
  } : $${knownVariables[0].symbol} = ${round(knownVariables[0].value, 2)
    .toTree()
    .toTex()} ${knownVariables[0].unit}$
  - ${
    knownVariables[1].name.charAt(0).toUpperCase() +
    knownVariables[1].name.slice(1)
  } : $${knownVariables[1].symbol} = ${round(knownVariables[1].value, 2)
    .toTree()
    .toTex()} ${knownVariables[1].unit}$. \n
  Déterminez ${
    targetVariable.name === "tension" || targetVariable.name === "résistance"
      ? "la"
      : "le"
  } ${targetVariable.name} ${
    targetVariable.name === "tension"
      ? "aux bords du"
      : targetVariable.name === "courant"
      ? "qui traverse le"
      : "du"
  } conducteur.`;

  const hint = `Rappelez-vous la loi d'Ohm : $U = R \\cdot I$.`;
  const correction = `La loi d'Ohm est donnée par :
  $U = R \\cdot I$. En utilisant les valeurs fournies pour ${
    knownVariables[0].name
  } et ${knownVariables[1].name}, vous pouvez résoudre pour ${
    targetVariable.name === "tension" || targetVariable.name === "résistance"
      ? "la"
      : "le"
  } ${targetVariable.name} :
  $${targetVariable.symbol} = ${round(knownVariables[0].value, 2)
    .toTree()
    .toTex()} \\times ${round(knownVariables[1].value, 2)
    .toTree()
    .toTex()} = ${round(targetVariable.value, 2).toTree().toTex()}\\ ${
    targetVariable.unit
  }$. \n
  Donc, ${
    targetVariable.name === "tension" || targetVariable.name === "résistance"
      ? "la"
      : "le"
  } ${targetVariable.name} est $${round(targetVariable.value, 2)
    .toTree()
    .toTex()}\\ ${targetVariable.unit}$.`;

  const question: Question<Identifiers> = {
    answer: round(targetVariable.value, 2).toTree().toTex(),
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      voltage,
      current,
      resistance,
      target: targetVariable.name,
      targetValue: targetVariable.value,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, voltage, current, resistance, target },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "tex");

  if (target === "tension") {
    tryToAddWrongProp(
      propositions,
      round(voltage * randfloat(0.1, 2), 2)
        .toTree()
        .toTex(),
    );
    tryToAddWrongProp(
      propositions,
      round(voltage / randfloat(0.1, 2), 2)
        .toTree()
        .toTex(),
    );
  } else if (target === "courant") {
    tryToAddWrongProp(
      propositions,
      round(current * randfloat(0.1, 2), 2)
        .toTree()
        .toTex(),
    );
    tryToAddWrongProp(
      propositions,
      round(current / randfloat(0.1, 2), 2)
        .toTree()
        .toTex(),
    );
  } else if (target === "résistance") {
    tryToAddWrongProp(
      propositions,
      round(resistance * randfloat(0.1, 2), 2)
        .toTree()
        .toTex(),
    );
    tryToAddWrongProp(
      propositions,
      round(resistance / randfloat(0.1, 2), 2)
        .toTree()
        .toTex(),
    );
  }
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(10, 100, 2).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, targetValue }) => {
  const validAnswer1 = round(targetValue, 2).toTree().toTex();
  const validAnswer2 = targetValue.toScientific(2).toTex();
  const validAnswer3 = targetValue.toScientific(1).toTex();
  const validAnswer4 = targetValue.toScientific(3).toTex();

  let latexs = [];
  latexs.push(validAnswer1, validAnswer2, validAnswer3, validAnswer4);
  return latexs.includes(ans);
};

export const OhmLawExercise: Exercise<Identifiers> = {
  id: "ohmLaw",
  label: "Utiliser la loi d'Ohm pour calculer tension, courant ou résistance",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) => getDistinctQuestions(getOhmLawQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
