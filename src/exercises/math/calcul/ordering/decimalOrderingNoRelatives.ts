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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = { type: number; a: number; b: number };

const getDecimalOrderingNoRelativesQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const type = randint(1, 5);
  let a = 0;
  let b = 0;
  while (b == a) {
    switch (type) {
      case 1:
        //x vs x.y
        a = randint(0, 100);
        b = randfloat(Math.floor(a), Math.floor(a) + 1, randint(1, 3));
        break;
      case 2:
        //x.y vs x.y
        a = randfloat(0, 100, 1);
        b = randfloat(Math.floor(a), Math.floor(a) + 1, 1);

        break;
      case 3:
        //x.yy vs x.yy
        a = randfloat(0, 100, 2);
        b = randfloat(Math.floor(a), Math.floor(a) + 1, 2);
        break;
      case 4:
      default:
        //x.yy vs x ou x.y
        a = randfloat(0, 100, 2);
        b = coinFlip()
          ? Math.floor(a)
          : randfloat(Math.floor(a), Math.floor(a) + 1, 1);
        break;
    }
  }
  const answer = a < b ? "<" : a === b ? "=" : ">";

  const question: Question<Identifiers> = {
    answer,
    instruction: `Compléter par le bon symbole : 
    
$$${a.frenchify()}\\ ...... \\ ${b.frenchify()}$$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { type, a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, "<");
  tryToAddWrongProp(propositions, ">");
  tryToAddWrongProp(propositions, "=");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const decimalOrderingNoRelatives: Exercise<Identifiers> = {
  id: "decimalOrderingNoRelatives",
  connector: "\\iff",
  label: "Comparer des nombres décimaux (sans relatifs)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDecimalOrderingNoRelativesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  answerType: "QCU",
};
