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
import {
  Polynomial,
  PolynomialConstructor,
} from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  random: number;
  a?: number;
  uCoeffs: number[];
  vCoeffs: number[];
};

const getExpSimplifiying: QuestionGenerator<Identifiers> = () => {
  const random = randint(1, 4);
  let a: number | undefined;
  let u: Polynomial, v: Polynomial;
  let expression: Node;
  let answer: string;
  switch (random) {
    case 1:
      //e^u*e^a / e^v
      a = randint(-9, 10, [0]);
      u = new Polynomial([0, randint(-9, 10, [0])]);
      v = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      expression = new FractionNode(
        new MultiplyNode(
          new ExpNode(u.toTree()),
          new ExpNode(new NumberNode(a)),
        ),
        new ExpNode(v.toTree()),
      );
      answer = new ExpNode(u.add(a).add(v.opposite()).toTree()).toTex();
      break;
    case 2:
      //e^u * e^v
      u = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      v = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      expression = new MultiplyNode(
        new ExpNode(u.toTree()),
        new ExpNode(v.toTree()),
      );
      (expression as MultiplyNode).shuffle();
      answer = new ExpNode(u.add(v).toTree()).toTex();

      break;
    case 3:
      //e^u / e^v
      u = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      v = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      expression = new FractionNode(
        new ExpNode(u.toTree()),
        new ExpNode(v.toTree()),
      );
      answer = new ExpNode(u.add(v.opposite()).toTree()).toTex();
      break;
    default:
      throw Error("something wrong happened");
  }

  const question: Question<Identifiers> = {
    instruction: `Simplifier l'expression $${expression.toTex()}$.`,
    answer,
    keys: ["x", "epower", "exp"],
    answerFormat: "tex",
    identifiers: {
      random,
      a,
      uCoeffs: u.coefficients,
      vCoeffs: v.coefficients,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, random, a, uCoeffs, vCoeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const u = new Polynomial(uCoeffs);
  const v = new Polynomial(vCoeffs);
  switch (random) {
    case 1:
      tryToAddWrongProp(
        propositions,
        new ExpNode(u.times(a!).add(v.opposite()).toTree()).toTex(),
      );
      break;
    case 2:
      tryToAddWrongProp(
        propositions,
        new ExpNode(u.multiply(v).toTree()).toTex(),
      );
      break;
    case 3:
      tryToAddWrongProp(
        propositions,
        new ExpNode(new FractionNode(u.toTree(), v.toTree())).toTex(),
      );
      tryToAddWrongProp(propositions, new ExpNode(u.add(v).toTree()).toTex());
      break;
    default:
      throw Error("received wrong quesiton type");
  }
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new ExpNode(PolynomialConstructor.randomWithOrder(1).toTree()).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { a, random, uCoeffs, vCoeffs },
) => {
  const u = new Polynomial(uCoeffs);
  const v = new Polynomial(vCoeffs);
  let answer: ExpNode;
  switch (random) {
    case 1:
      answer = new ExpNode(u.add(a!).add(v.opposite()).toTree());
      break;
    case 2:
      answer = new ExpNode(u.add(v).toTree());

      break;
    case 3:
      answer = new ExpNode(u.add(v.opposite()).toTree());
      break;
    default:
      throw Error("wrong random in exp simplifying");
  }
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const expSimplifiying: Exercise<Identifiers> = {
  id: "expSimplifiying",
  connector: "\\iff",
  label: "Simplifier des expressions avec l'exponentielle",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  sections: ["Exponentielle"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpSimplifiying, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
