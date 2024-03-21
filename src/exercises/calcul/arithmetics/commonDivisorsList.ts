import {
  MathExercise,
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
import { dividersOf } from "#root/math/utils/arithmetic/dividersOf";
import { gcd } from "#root/math/utils/arithmetic/gcd";
import { isPrime } from "#root/math/utils/arithmetic/isPrime";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  a: number;
  b: number;
};

const getCommonDivisorsListQuestion: QuestionGenerator<Identifiers> = () => {
  const a = doWhile(
    () => randint(30, 150),
    (x) => isPrime(x),
  );
  const b = doWhile(
    () => randint(30, 150),
    (x) => x === a || gcd(a, x) === 1,
  );

  const divisorsA = dividersOf(a);
  const divisorsB = dividersOf(b);
  const res: number[] = [];
  divisorsA.forEach((n) => divisorsB.includes(n) && res.push(n));

  res.sort((a, b) => a - b);
  const answer = res.join(",");
  const question: Question<Identifiers> = {
    answer,
    instruction: `Donner la liste des diviseurs communs à ${a} et ${b} (séparer les valeurs par des virgules).`,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const values = answer.split(",").map((v) => Number(v));
  const max = Math.max(a, b);
  while (propositions.length < n) {
    const newValue = doWhile(
      () => randint(2, max),
      (x) => values.includes(max),
    );
    const copy = values.slice();
    const willRemove = coinFlip();
    willRemove
      ? copy.splice(randint(0, values.length), 1)
      : copy.splice(0, 0, newValue);
    tryToAddWrongProp(
      propositions,
      willRemove ? copy.join(",") : copy.sort((a, b) => a - b).join(","),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  let values = ans.split(",").map((v) => Number(v));
  if (values.some((v) => isNaN(v))) return false;
  values.sort((a, b) => a - b);
  return values.join(",") === answer;
};
export const commonDivisorsList: MathExercise<Identifiers> = {
  id: "commonDivisorsList",
  label: "Déterminer les diviseurs communs de deux nombres",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Arithmétique"],
  generator: (nb: number) =>
    getDistinctQuestions(getCommonDivisorsListQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
