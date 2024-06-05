import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  SVGSignTableVEA,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {};

const getSignTableOfAffineFunctQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const question: Question<Identifiers> = {
    answer: "test",
    instruction: `${randint(1, 100)}`,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isSvgSignTableAnswerValid: SVGSignTableVEA<Identifiers> = (
  ans,
  { answer },
) => {
  console.log(typeof ans);
  return false;
};

export const signTableOfAffineFunct: Exercise<Identifiers> = {
  id: "signTableOfAffineFunct",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getSignTableOfAffineFunctQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "SVG",
  isSvgSignTableAnswerValid,
  subject: "Mathématiques",
};
