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
import { dividersOf } from "#root/math/utils/arithmetic/dividersOf";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  a: number;
};

const getDivisorsListQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(30, 90);
  const divisors = dividersOf(a);
  const answer = divisors.join(";");
  const question: Question<Identifiers> = {
    answer,
    instruction: `Donner la liste des diviseurs de $${a}$ (séparer les valeurs par des point-virgules).`,
    keys: ["semicolon"],
    answerFormat: "tex",
    identifiers: { a },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const values = answer.split(";").map((v) => Number(v));
  while (propositions.length < n) {
    const newValue = doWhile(
      () => randint(2, values[values.length - 1]),
      (x) => values.includes(x),
    );
    const copy = values.slice();
    const willRemove = coinFlip();
    willRemove
      ? copy.splice(randint(0, values.length), 1)
      : copy.splice(0, 0, newValue);
    tryToAddWrongProp(
      propositions,
      willRemove ? copy.join(";") : copy.sort((a, b) => a - b).join(";"),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  let values = ans
    .replaceAll(",", ";")
    .split(";")
    .map((v) => Number(v));
  if (values.some((v) => isNaN(v))) return false;
  values.sort((a, b) => a - b);
  return values.join(";") === answer;
};
export const divisorsList: Exercise<Identifiers> = {
  id: "divisorsList",
  label: "Déterminer les diviseurs d'un nombre",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Arithmétique"],
  generator: (nb: number) => getDistinctQuestions(getDivisorsListQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
