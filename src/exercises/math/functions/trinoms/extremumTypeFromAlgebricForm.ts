import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  addWrongProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getExtremumTypeFromAlgebricFormQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const isDevForm = coinFlip();
  const trinom = isDevForm
    ? TrinomConstructor.random()
    : TrinomConstructor.randomCanonical();
  const answer = trinom.a > 0 ? "Un minimum" : "Un maximum";

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `La fonction $f$ définie par $f(x) = ${
      isDevForm ? trinom.toTree().toTex() : trinom.getCanonicalForm().toTex()
    }$ admet-elle un maximum ou un minimum ?`,
    answerFormat: "raw",
    keys: [],
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, a < 0 ? "Un minimum" : "Un maximum", "raw");
  shuffle(propositions);
  addWrongProp(propositions, "On ne peut pas savoir", "raw");
  addWrongProp(propositions, "Ni l'un ni l'autre", "raw");
  return propositions;
};

export const extremumTypeFromAlgebricForm: Exercise<Identifiers> = {
  id: "extremumTypeFromAlgebricForm",
  label:
    "Déterminer le type d'extremum d'une fonction du second degré via sa forme algébrique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getExtremumTypeFromAlgebricFormQuestion, nb),
  answerType: "QCM",
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  subject: "Mathématiques",
};
