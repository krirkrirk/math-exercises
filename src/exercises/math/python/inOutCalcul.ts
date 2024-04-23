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

const getInOutCalculQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(0, 5);
  const b = randint(0, 5);
  const c = b + a;
  const d = a - c;
  const answer = d.toString();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Qu'affichera le programme suivant ? `,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b },
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

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const inOutCalcul: Exercise<Identifiers> = {
  id: "inOutCalcul",
  label: "Évaluation de scripts python entrée/sortie",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getInOutCalculQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
