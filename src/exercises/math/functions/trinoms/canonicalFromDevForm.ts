import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { DiscreteSet } from "#root/math/sets/discreteSet";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const getCanonicalFromDevFormQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const answer = trinom.getCanonicalForm().toTex();
  const question: Question<Identifiers> = {
    answer,
    keys: ["x", "equal", "alpha", "beta"],
    instruction: `Déterminer la forme canonique de la fonction $f$ définie par $f(x) = ${trinom
      .toTree()
      .toTex()}$`,
    answerFormat: "tex",
    identifiers: { a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      TrinomConstructor.randomCanonical({ from: [a, -a] })
        .getCanonicalForm()
        .toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const trinom = new Trinom(a, b, c);
  const node = trinom.getCanonicalForm();
  const texs = node.toAllValidTexs();
  return texs.includes(ans);
};

export const canonicalFromDevForm: Exercise<Identifiers> = {
  id: "canonicalFromDevForm",
  connector: "\\iff",
  label: "Déterminer la forme canonique à partir de la forme développée",
  levels: ["1reSpé"],
  isSingleStep: false,
  sections: ["Second degré"],
  generator: (nb: number) =>
    getDistinctQuestions(getCanonicalFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
