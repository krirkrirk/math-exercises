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
import { randint } from "#root/math/utils/random/randint";
import { InequationNode } from "#root/tree/nodes/inequations/inequationNode";
import { PlusInfinityNode } from "#root/tree/nodes/numbers/infiniteNode";
import { Closure, ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";

type Identifiers = {
  a: number;
  b: number;
  closure: ClosureType;
  type: number;
};

// a < x < b avec a > 0  ==> a^2 < x^2 < b^2
// a < x < b avec b < 0  ==> b^2 < x^2 < a^2
// a < x < b avec a<0 et b>0 ==> 0 < x^2 < max(|a|,|b|)^2

const getAnswer = (
  a: number,
  b: number,
  type: number,
  closure: ClosureType,
) => {
  switch (type) {
    case 1:
      return new IntervalNode((a ** 2).toTree(), (b ** 2).toTree(), closure);
    case 2:
      return new IntervalNode(
        (b ** 2).toTree(),
        (a ** 2).toTree(),
        Closure.switch(closure),
      );
    case 3:
    default:
      const max = Math.max(Math.abs(a), Math.abs(b));

      const maxClosure =
        Math.abs(a) === Math.abs(b)
          ? closure !== ClosureType.OO
            ? "F"
            : "O"
          : max === Math.abs(a)
          ? closure === ClosureType.FF || closure === ClosureType.FO
            ? "F"
            : "O"
          : closure === ClosureType.FF || closure === ClosureType.OF
          ? "F"
          : "O";
      const ansClosure = maxClosure === "F" ? ClosureType.FF : ClosureType.FO;
      return new IntervalNode(
        (0).toTree(),
        (Math.max(Math.abs(a), Math.abs(b)) ** 2).toTree(),
        ansClosure,
      );
  }
};
const getSquareImageIntervalQuestion: QuestionGenerator<Identifiers> = () => {
  let a: number;
  let b: number;
  let instruction = "";
  let closure: ClosureType;
  const type = randint(1, 4);
  switch (type) {
    case 1:
      a = randint(0, 8);
      b = randint(a + 1, a + 5);
      closure = Closure.random();
      instruction = new IntervalNode(a.toTree(), b.toTree(), closure)
        .toInequality()
        .toTex();
      break;
    case 2:
      b = randint(-5, 0);
      a = randint(b - 5, b);
      closure = Closure.random();

      instruction = new IntervalNode(a.toTree(), b.toTree(), closure)
        .toInequality()
        .toTex();
      break;
    case 3:
    default:
      a = randint(-9, 0);
      b = randint(1, 10);
      closure = Closure.random();

      instruction = new IntervalNode(a.toTree(), b.toTree(), closure)
        .toInequality()
        .toTex();
      break;
  }
  const answer = getAnswer(a, b, type, closure).toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $${instruction}$. A quel intervalle appartient $x^2$ ?`,
    keys: ["lbracket", "semicolon", "rbracket"],
    answerFormat: "tex",
    identifiers: { a, b, closure, type },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, type, closure },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new IntervalNode(a.toTree(), b.toTree(), closure).toTex(),
  );
  if (type === 3) {
    const min = Math.min(Math.abs(a), Math.abs(b)) ** 2;
    const max = Math.max(Math.abs(a), Math.abs(b)) ** 2;
    tryToAddWrongProp(
      propositions,
      new IntervalNode(min.toTree(), max.toTree(), closure).toTex(),
    );
  }

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      getAnswer(a, b, type, Closure.random()).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, a, b, closure, type },
) => {
  const interval = getAnswer(a, b, type, closure);
  const texs = interval.toAllValidTexs();
  return texs.includes(ans);
};
export const squareImageInterval: MathExercise<Identifiers> = {
  id: "squareImageInterval",
  label: "Passer une inégalité au carré",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Fonctions de référence", "Ensembles et intervalles"],
  generator: (nb: number) =>
    getDistinctQuestions(getSquareImageIntervalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
