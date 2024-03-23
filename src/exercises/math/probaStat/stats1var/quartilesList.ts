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
  shuffleProps,
  tryToAddWrongProp,
} from "../../../exercise";
import { getDistinctQuestions } from "../../../utils/getDistinctQuestions";

type Identifiers = {
  randomValues: number[];
  randomQuartile: number;
};

const getQuartiles: QuestionGenerator<Identifiers> = () => {
  let randomValues: number[] = [];
  const length = randint(5, 9);

  for (let i = 0; i < length; i++) randomValues.push(randint(1, 20));

  const sortedValues = randomValues.sort((a, b) => a - b);

  const firstQuartileIndex = Math.round(randomValues.length / 4 + 0.49);
  const thirdQuartileIndex = Math.round((3 * randomValues.length) / 4 + 0.49);

  const firstQuartile = sortedValues[firstQuartileIndex - 1];
  const thirdQuartile = sortedValues[thirdQuartileIndex - 1];

  const randomQuartile = randint(0, 2);

  let quartileToString;
  let choosenQuartile: number;

  switch (randomQuartile) {
    case 0:
      quartileToString = "premier quartile";
      choosenQuartile = firstQuartile;
      break;

    case 1:
      quartileToString = "troisième quartile";
      choosenQuartile = thirdQuartile;
      break;

    default:
      quartileToString = "troisième quartile";
      choosenQuartile = thirdQuartile;
      break;
  }

  const answer = choosenQuartile + "";
  const question: Question<Identifiers> = {
    instruction: `On considère la liste suivante : $${randomValues.join(
      ";\\ ",
    )}.$
    $\\\\$Calculer le ${quartileToString} de cette série de valeurs.`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { randomValues, randomQuartile },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, randomValues },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  randomValues.forEach((value) => {
    tryToAddWrongProp(propositions, value + "");
  });

  while (propositions.length < n) {
    const randValue = randint(0, 100);
    tryToAddWrongProp(propositions, randValue + "");
  }

  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const quartilesList: Exercise<Identifiers> = {
  id: "quartilesList",
  connector: "=",
  label: "Calcul des quartiles d'une liste",
  levels: ["3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  isSingleStep: false,
  sections: ["Statistiques"],
  generator: (nb: number) => getDistinctQuestions(getQuartiles, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
