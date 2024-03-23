import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../../exercise";
import { getDistinctQuestions } from "../../../utils/getDistinctQuestions";

type Identifiers = {
  randomValues: number[];
};

const getMedianWithTable: QuestionGenerator<Identifiers> = () => {
  const getRandomUniqueValues = (
    count: number,
    min: number,
    max: number,
  ): number[] => {
    const uniqueValues: Set<number> = new Set();

    while (uniqueValues.size < count) {
      uniqueValues.add(randint(min, max));
    }

    return Array.from(uniqueValues).sort((a, b) => a - b);
  };

  const randomValues: number[] = getRandomUniqueValues(5, 1, 20);
  const randomEffectives = [1, 2, 3, 4, 5].map((el) => randint(1, 6));

  let sortedValues: number[] = [];

  for (let i = 0; i < randomEffectives.length; i++)
    for (let j = 0; j < randomEffectives[i]; j++)
      sortedValues.push(randomValues[i]);

  const n = randomEffectives.reduce((sum, value) => sum + value, 0);
  const middleIndex = Math.floor(n / 2);

  let median: number;

  if (n % 2 === 0) {
    median = (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  } else {
    median = sortedValues[middleIndex];
  }

  const answer = (median + "").replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `On considère le tableau d'effectifs suivant : 

| | | | | | |
|-|-|-|-|-|-|
|Valeur|${randomValues[0]}|${randomValues[1]}|${randomValues[2]}|${randomValues[3]}|${randomValues[4]}|
|Effectif|${randomEffectives[0]}|${randomEffectives[1]}|${randomEffectives[2]}|${randomEffectives[3]}|${randomEffectives[4]}|

Calculer la médiane de cette série de valeurs.`,

    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { randomValues },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomValues },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      randomValues[randint(0, randomValues.length)] + "",
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const medianWithTable: Exercise<Identifiers> = {
  id: "medianWithTable",
  connector: "=",
  label: "Calcul de la médiane d'un tableau d'effectifs",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: false,
  sections: ["Statistiques"],
  generator: (nb: number) => getDistinctQuestions(getMedianWithTable, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
