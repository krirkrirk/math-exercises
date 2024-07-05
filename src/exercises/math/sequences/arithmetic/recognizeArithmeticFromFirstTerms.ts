import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  addWrongProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { doWhile } from "#root/utils/doWhile";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  sequences: number[][];
  answerIndex: number;
};

const getRecognizeArithmeticFromFirstTermsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const sequences: number[][] = [];

  const firstGeoTerm = randint(1, 4);
  const geoReason = random([2, 3]);
  sequences[0] = new Array(5)
    .fill(0)
    .map((el, index) => firstGeoTerm * geoReason ** index);

  const firstBernoulliTerm = randint(1, 10);
  const secondBernoulliTerm = randint(1, 10, [firstBernoulliTerm]);
  sequences[1] = new Array(5)
    .fill(0)
    .map((el, index) => (index % 2 ? firstBernoulliTerm : secondBernoulliTerm));

  const firstFakeAriTerm = randint(1, 20);
  sequences[2] = new Array(5)
    .fill(0)
    .map((el, index) => firstFakeAriTerm + randint(1, 4));
  const disruptionIndex = randint(0, 5);
  sequences[2][disruptionIndex] =
    sequences[2][disruptionIndex] + random([-1, 1]);
  shuffle(sequences);

  const firstTerm = randint(1, 20);
  const reason = randint(-5, 6, [0]);
  const rightSequence = new Array(5)
    .fill(0)
    .map((el, index) => firstTerm + index * reason);

  const answerIndex = randint(0, 4);
  sequences.splice(answerIndex, 0, rightSequence);
  const answer = `\\text{Suite ${answerIndex + 1} : }${rightSequence.join(
    "\\ ; \\ ",
  )}`;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Parmi les suites suivantes, laquelle semble être arithmétique ?`,
    keys: [],
    answerFormat: "tex",

    identifiers: { sequences, answerIndex },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, sequences, answerIndex },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  sequences.forEach((sequence, index) => {
    if (index === answerIndex) return;
    addWrongProp(
      propositions,
      `\\text{Suite ${index + 1} : }${sequence.join("\\ ; \\ ")}`,
    );
  });
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const recognizeArithmeticFromFirstTerms: Exercise<Identifiers> = {
  id: "recognizeArithmeticFromFirstTerms",
  label: "Reconnaître une suite arithmétique via ses premiers termes",
  levels: ["1reSpé", "1rePro", "1reTech", "1reESM"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getRecognizeArithmeticFromFirstTermsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCM",
  subject: "Mathématiques",
};
