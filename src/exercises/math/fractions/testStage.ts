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
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  a: number;
  b: number;
};

const getTestStageQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(1, 10);
  const b = randint(1, 10);

  const question: Question<Identifiers> = {
    answer: `${a + b}`,
    instruction: `Calculer $${a}+${b}$`,
    keys: ["sin"],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, a * b + "");

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(1, 10) + "");
  }
  return shuffleProps(propositions, n);
};

//ans = input élève
const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, b }) => {
  const validAnswers = [a + b + "", a - b + ""];
  return validAnswers.includes(ans);
};

export const testStage: Exercise<Identifiers> = {
  id: "testStage",
  label: "Calculer la fraction",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Arithmétique"],
  generator: (nb: number) => getDistinctQuestions(getTestStageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
