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
import { Vector } from "#root/math/geometry/vector";
import { AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";

type Identifiers = {
  a: number;
  b: number;
};

const getLeadingCoeffAndOriginOrdinateQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const f = AffineConstructor.random();
  const a = f.a;
  const b = f.b;
  const quesiton = `Soit la fonction affine $f=${a}x+${b}$, déterminer la valeur du coefficient directeur et de l'ordonnée à l'origine.`;
  const question: Question<Identifiers> = {
    answer: "",
    instruction: ``,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(a, b).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  let random;
  while (propositions.length < n) {
    random = `\\left(${randint(a - 10, a + 11, [a])};${randint(b - 10, b + 11, [
      b,
    ])}\\right)`;
    tryToAddWrongProp(propositions, random);
  }
  return shuffleProps(propositions, n);
};

const generateProposition = (a: number, b: number) => {
  const firstProposition = `\\left(${b};${a}\\right)`;
  const secondProposition = `\\left(${b};${b}\\right)`;
  return [firstProposition, secondProposition];
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};
export const leadingCoeffAndOriginOrdinate: Exercise<Identifiers> = {
  id: "leadingCoeffAndOriginOrdinate",
  label: "",
  levels: ["2nde"],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getLeadingCoeffAndOriginOrdinateQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
