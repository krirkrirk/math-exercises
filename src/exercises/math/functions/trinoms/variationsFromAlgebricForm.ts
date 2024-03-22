import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  addWrongProp,
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
const getVariationsFromAlgebricFormQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const isDevForm = coinFlip();
  const trinom = isDevForm
    ? TrinomConstructor.random()
    : TrinomConstructor.randomCanonical();
  const answer =
    trinom.a > 0
      ? "Décroissante puis croissante"
      : "Croissante puis décroissante";

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Quelles sont les variations de la fonction $f$ définie par $f(x) = ${
      isDevForm ? trinom.toTree().toTex() : trinom.getCanonicalForm().toTex()
    }$ ?`,
    answerFormat: "raw",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  addWrongProp(
    propositions,
    a < 0 ? "Décroissante puis croissante" : "Croissante puis décroissante",
    "raw",
  );

  addWrongProp(propositions, "Constante", "raw");
  addWrongProp(propositions, "On ne peut pas savoir", "raw");

  return shuffle(propositions);
};

export const variationsFromAlgebricForm: Exercise<Identifiers> = {
  id: "variationsFromAlgebricForm",
  label:
    "Déterminer les variations d'une fonction du second degré via sa forme algébrique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getVariationsFromAlgebricFormQuestion, nb),
  answerType: "QCM",
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  subject: "Mathématiques",
};
