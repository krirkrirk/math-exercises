import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
import { v4 } from "uuid";
type Identifiers = {
  sortedValues: number[];
};

const getMedianList: QuestionGenerator<Identifiers> = () => {
  let randomValues: number[] = [];
  const length = randint(6, 10);

  for (let i = 0; i < length; i++) randomValues.push(randint(1, 20));

  const sortedValues = randomValues.sort((a, b) => a - b);

  const middleIndex = Math.floor(randomValues.length / 2);

  let median: number;

  if (randomValues.length % 2 === 0) {
    median = (sortedValues[middleIndex - 1] + sortedValues[middleIndex]) / 2;
  } else {
    median = sortedValues[middleIndex];
  }
  const answer = (median + "").replace(".", ",");
  const question: Question<Identifiers> = {
    instruction: `On considère la liste suivante : $${randomValues.join(
      ";\\ ",
    )}.$
    $\\\\$Calculer la médiane de cette liste de valeurs.`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { sortedValues },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, sortedValues },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  sortedValues.forEach((value) => tryToAddWrongProp(propositions, value + ""));

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 20) + "");
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const medianWithList: MathExercise<Identifiers> = {
  id: "medianWithList",
  connector: "=",
  label: "Calcul de la médiane d'une liste de valeurs",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: false,
  sections: ["Statistiques"],
  generator: (nb: number) => getDistinctQuestions(getMedianList, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
