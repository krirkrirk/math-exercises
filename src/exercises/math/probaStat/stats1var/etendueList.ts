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
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  sortedValues: number[];
};

const getEtendueListQuestion: QuestionGenerator<Identifiers> = () => {
  let randomValues: number[] = [];
  const length = randint(6, 10);

  for (let i = 0; i < length; i++) randomValues.push(randint(1, 20));

  const sortedValues = randomValues.sort((a, b) => a - b);
  const answer = (
    sortedValues[sortedValues.length - 1] - sortedValues[0]
  ).frenchify();
  const question: Question<Identifiers> = {
    answer,
    instruction: `On considère la liste suivante : $${randomValues.join(
      ";\\ ",
    )}.$
    $\\\\$Calculer l'étendue de cette liste de valeurs.`,
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
  tryToAddWrongProp(propositions, sortedValues[sortedValues.length - 1] + "");
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(5, 20) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const etendueList: Exercise<Identifiers> = {
  id: "etendueList",
  connector: "=",
  label: "Calcul de l'étendue d'une liste de valeurs",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) => getDistinctQuestions(getEtendueListQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
