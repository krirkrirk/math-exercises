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
  subPopulationEffectif: number;
  subPopulationPercent: number;
  contextType: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, contextType, subPopulationEffectif, subPopulationPercent },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    round((subPopulationPercent * 100) / subPopulationEffectif, 0).frenchify(),
  );
  tryToAddWrongProp(
    propositions,
    round((subPopulationPercent * subPopulationEffectif) / 100, 0).frenchify(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      randint(
        subPopulationEffectif,
        subPopulationEffectif * 2 + 10,
      ).frenchify(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return round(
    (identifiers.subPopulationEffectif * 100) /
      identifiers.subPopulationPercent,
    0,
  ).frenchify();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const arrondi = "Arrondir à l'unité si nécessaire.";
  switch (identifiers.contextType) {
    case 0:
      return `Dans une classe, $${identifiers.subPopulationPercent.frenchify()}\\%$ des élèves sont des garcons, ce qui représente $${
        identifiers.subPopulationEffectif
      }$ élèves. Quel est le nombre d'élèves dans cette classe ? ${arrondi}`;
    case 1:
      return `Dans un collège, $${identifiers.subPopulationPercent.frenchify()}\\%$ des élèves sont gauchers, ce qui représente $${
        identifiers.subPopulationEffectif
      }$ élèves. Quel est le nombre d'élèves dans ce collège ? ${arrondi}`;
    case 2:
    default:
      return `Dans une ville, $${identifiers.subPopulationPercent.frenchify()}\\%$ des habitants sont à la retraite, ce qui représente $${
        identifiers.subPopulationEffectif
      }$ habitants. Quel est le nombre d'habitants dans cette ville ? ${arrondi}`;
  }
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberParser(ans) === answer;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  const itemType = identifiers.contextType === 2 ? "habitants" : "élèves";
  return `Utilise un produit en croix : si $${identifiers.subPopulationPercent.frenchify()}\\%$ représente $${
    identifiers.subPopulationEffectif
  }$ ${itemType}, alors que représente $100\\%$ ?`;
};

const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const itemType = identifiers.contextType === 2 ? "habitants" : "élèves";
  const answer = getAnswer(identifiers);
  return `On sait que $${identifiers.subPopulationPercent.frenchify()}\\%$ représente $${
    identifiers.subPopulationEffectif
  }$ ${itemType}, et on cherche ce que réprésente $100\\%$ des ${itemType}.
  
  Pour cela, on peut faire un produit en croix : 
  
|$?$|$100\\%$|
|-|-|
|$${
    identifiers.subPopulationEffectif
  }$|$${identifiers.subPopulationPercent.frenchify()}\\%$|

Pour trouver la valeur manquante, il faut donc faire le calcul suivant : 

$$
\\frac{${
    identifiers.subPopulationEffectif
  } \\times 100}{${identifiers.subPopulationPercent.frenchify()}} \\approx ${answer}
$$
`;
};
const getPopulationEffectifFromSubPopulationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const contextType = randint(0, 3);
  let subPopulationEffectif: number, subPopulationPercent: number;

  switch (contextType) {
    case 0:
      subPopulationEffectif = randint(5, 10);
      subPopulationPercent = coinFlip()
        ? randint(30, 70)
        : randfloat(30, 70, 2);
      break;
    case 1:
      subPopulationEffectif = randint(100, 1000);
      subPopulationPercent = coinFlip()
        ? randint(1, 100)
        : randfloat(1, 100, 2);
      break;
    case 2:
    default:
      subPopulationEffectif = randint(1000, 10000);
      subPopulationPercent = coinFlip()
        ? randint(1, 100)
        : randfloat(1, 100, 2);
      break;
  }
  const identifiers: Identifiers = {
    contextType,
    subPopulationEffectif,
    subPopulationPercent,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
    style: {
      tableHasNoHeader: true,
    },
  };

  return question;
};

export const populationEffectifFromSubPopulation: Exercise<Identifiers> = {
  id: "populationEffectifFromSubPopulation",
  connector: "=",
  label:
    "Calculer l'effectif d'un ensemble en connaissant la proportion et l'effectif d'un sous-ensemble",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getPopulationEffectifFromSubPopulationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
};
