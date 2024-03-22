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
  reason: number;
  sequence: number[];
};

const getRecognizeReasonFromFirstTermsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const firstTerm = randint(1, 20);
  const reason = randint(-5, 6, [0]);
  const sequence = new Array(5)
    .fill(0)
    .map((el, index) => firstTerm + index * reason);

  const question: Question<Identifiers> = {
    answer: reason + "",
    instruction: `Voici les premiers termes d'une suite arithmétique $u$ : $${sequence.join(
      "\\ ; \\ ",
    )}$. Quelle est la raison de $u$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { sequence, reason },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-5, 6) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const recognizeReasonFromFirstTerms: Exercise<Identifiers> = {
  id: "recognizeReasonFromFirstTerms",
  label:
    "Reconnaître la raison d'une suite arithmétique via ses premiers termes",
  levels: ["1reESM", "1rePro", "1reSpé", "1reTech"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getRecognizeReasonFromFirstTermsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
