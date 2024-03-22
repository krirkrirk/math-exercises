import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  final: number;
};

const getFirstIntegersSumQuestion: QuestionGenerator<Identifiers> = () => {
  const final = randint(20, 100);
  const answer = `${(final * (final + 1)) / 2}`;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer la somme suivante : $1+2+3+\\ldots + ${final}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { final },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, final }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `${(final * (final - 1)) / 2}`);
  tryToAddWrongProp(propositions, `${final * (final + 1)}`);
  while (propositions.length < n) {
    const wrongAnswer = randint(30, 200) + "";
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const firstIntegersSum: Exercise<Identifiers> = {
  id: "firstIntegersSum",
  connector: "=",
  label: "Somme des $n$ premiers entiers",
  levels: ["1rePro", "1reTech", "1reSpé", "1reESM"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getFirstIntegersSumQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
