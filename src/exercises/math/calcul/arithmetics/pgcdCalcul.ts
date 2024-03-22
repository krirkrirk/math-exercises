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
import { gcd } from "#root/math/utils/arithmetic/gcd";
import { isPrime } from "#root/math/utils/arithmetic/isPrime";
import { randint } from "#root/math/utils/random/randint";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  a: number;
  b: number;
};

const getPgcdCalculQuestion: QuestionGenerator<Identifiers> = () => {
  const a = doWhile(
    () => randint(30, 150),
    (x) => isPrime(x),
  );
  const b = doWhile(
    () => randint(30, 150),
    (x) => x === a || gcd(a, x) === 1,
  );
  const pgcd = gcd(a, b);
  const question: Question<Identifiers> = {
    answer: pgcd + "",
    instruction: `Donner le PGCD de ${a} et ${b}`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "1");

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(2, 11) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const pgcdCalcul: Exercise<Identifiers> = {
  id: "pgcdCalcul",
  connector: "=",
  label: "Calculer un PGCD",
  levels: ["2nde", "1reSpé", "MathExp"],
  isSingleStep: true,
  sections: ["Arithmétique"],
  generator: (nb: number) => getDistinctQuestions(getPgcdCalculQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
