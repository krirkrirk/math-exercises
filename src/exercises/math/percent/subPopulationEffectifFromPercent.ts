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
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { numberParser } from "#root/tree/parsers/numberParser";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  contextType: number;
  total: number;
  populationPercent: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, total }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, total).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(
    identifiers.total * (identifiers.populationPercent / 100),
    0,
  ).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const arrondi = "Arrondir à l'unité si nécessaire.";
  switch (identifiers.contextType) {
    case 0:
      return `Dans une classe de $${
        identifiers.total
      }$ élèves, $${identifiers.populationPercent.frenchify()}\\%$ des élèves sont des garcons. Quel est le nombre de garcons dans cette classe ? ${arrondi}`;
    case 1:
      return `Dans un collège de $${
        identifiers.total
      }$ élèves, $${identifiers.populationPercent.frenchify()}\\%$ des élèves sont gauchers. Quel est le nombre de gauchers dans ce collège ? ${arrondi}`;
    case 2:
    default:
      return `Dans une ville de $${
        identifiers.total
      }$ habitants, $${identifiers.populationPercent.frenchify()}\\%$ des habitants sont à la retraite. Quel est le nombre de retraités dans cette ville ? ${arrondi}`;
  }
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Pour calculer $t\\%$ d'un nombre, on le multiplie par $\\frac{t}{100}$.`;
};

const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const answer = getAnswer(identifiers);
  return `Pour calculer $t\\%$ d'un nombre, on le multiplie par $\\frac{t}{100}$.
  
  Ici, on calcule $${identifiers.populationPercent.frenchify()}\\%$ de $${
    identifiers.total
  }$ :
  
$$
${
  identifiers.total
}\\times \\frac{${identifiers.populationPercent.frenchify()}}{100} \\approx ${answer}
$$

`;
};
const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberParser(ans) === answer;
};
const getSubPopulationEffectifFromPercentQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const contextType = randint(0, 3);
  let total: number, populationPercent: number;
  switch (contextType) {
    case 0:
      total = randint(20, 40);
      populationPercent = coinFlip() ? randint(1, 100) : randfloat(1, 100, 2);
      break;
    case 1:
      total = randint(100, 1000);
      populationPercent = coinFlip() ? randint(1, 100) : randfloat(1, 100, 2);
      break;
    case 2:
    default:
      total = randint(1000, 10000);
      populationPercent = coinFlip() ? randint(1, 100) : randfloat(1, 100, 2);
      break;
  }
  const identifiers: Identifiers = {
    contextType,
    populationPercent,
    total,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const subPopulationEffectifFromPercent: Exercise<Identifiers> = {
  id: "subPopulationEffectifFromPercent",
  connector: "=",
  label: "Calculer l'effectif d'un sous-ensemble via sa proportion",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getSubPopulationEffectifFromPercentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getAnswer,
  getCorrection,
  getHint,
  hasHintAndCorrection: true,
};
