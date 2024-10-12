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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { LogNode } from "#root/tree/nodes/functions/logNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  pm: number;
  a: number;
  b: number;
};

const getExpSimplifiying: QuestionGenerator<Identifiers> = () => {
  let expression;
  let simplifiedExpression: LogNode;
  let pm = coinFlip() ? 1 : -1;
  const a = randint(1, 10);
  let b: number;
  do {
    b = randint(1, 10);
  } while (pm === -1 && a === b);

  const opts = { allowLnOfOne: true };
  if (pm === 1) {
    expression = new AddNode(
      new LogNode(new NumberNode(a), opts),
      new LogNode(new NumberNode(b), opts),
    );
    simplifiedExpression = new LogNode(new NumberNode(a * b));
  } else {
    expression = new SubstractNode(
      new LogNode(new NumberNode(a), opts),
      new LogNode(new NumberNode(b), opts),
    );
    simplifiedExpression = new LogNode(new Rational(a, b).simplify().toTree());
  }

  const answer = simplifiedExpression.toTex();
  const question: Question<Identifiers> = {
    instruction: `Ecrire le nombre suivant sous la forme $\\ln\\left(a\\right)$ : $\\newline ${expression.toTex()}$.`,
    answer,
    keys: ["ln"],
    answerFormat: "tex",
    identifiers: { pm, a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, pm }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const a = randint(1, 10);
    const b = randint(1, 10);
    tryToAddWrongProp(
      propositions,
      pm > 0
        ? new LogNode(new NumberNode(a * b)).toTex()
        : new LogNode(new Rational(a, b).simplify().toTree()).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, pm }) => {
  let answer: Node;
  if (pm === 1) {
    answer = new LogNode(new NumberNode(a * b));
  } else {
    answer = new LogNode(
      new Rational(a, b).simplify().toTree({ allowFractionToDecimal: true }),
    );
  }
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const logSimplifiying: Exercise<Identifiers> = {
  id: "logSimplifiying",
  connector: "\\iff",
  label: "Simplifier des expressions avec $\\ln$",
  levels: ["1reSpé", "TermSpé", "MathComp"],
  sections: ["Logarithme népérien"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpSimplifiying, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
