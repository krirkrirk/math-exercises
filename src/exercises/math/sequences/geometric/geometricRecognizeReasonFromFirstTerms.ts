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
  sequence: number[];
  reason: number;
};

const getGeometricRecognizeReasonFromFirstTermsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const firstTerm = randint(1, 20);
  const reason = randint(-5, 6, [0, 1]);
  const sequence = new Array(5)
    .fill(0)
    .map((el, index) => firstTerm * Math.pow(reason, index));

  const question: Question<Identifiers> = {
    answer: reason + "",
    instruction: `Voici les premiers termes d'une suite géométrique $u$ : $${sequence.join(
      "\\ ; \\ ",
    )}$. Quelle est la raison de $u$ ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { sequence, reason },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, reason }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, reason + randint(-5, 5, [0]) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const geometricRecognizeReasonFromFirstTerms: Exercise<Identifiers> = {
  id: "geometricRecognizeReasonFromFirstTerms",
  connector: "=",
  label:
    "Reconnaître la raison d'une suite géométrique via ses premiers termes",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getGeometricRecognizeReasonFromFirstTermsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
