import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getMultiplicationEquation: QuestionGenerator<QCMProps, VEAProps> = () => {
  // (ax + b)(cx + d) = 0
  let a, b, c, d;
  do {
    a = randint(-9, 10, [0]);
    b = randint(-9, 10, [0]);
    c = randint(-9, 10, [0]);
    d = randint(-9, 10, [0]);
  } while (a / c === b / d);

  const polynome1 = new Polynomial([b, a]);
  const polynome2 = new Polynomial([d, c]);

  const answer = `S=\\left\\{${new Rational(-b, a).simplify().toTree().toTex()};${new Rational(-d, c)
    .simplify()
    .toTree()
    .toTex()}\\right\\}`;

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre : $(${polynome1.toTex()})(${polynome2.toTex()}) = 0$`,
    startStatement: `(${polynome1.toTex()})(${polynome2.toTex()}) = 0`,
    answer,
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'ou'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    let a: number, b: number, c: number, d: number;
    do {
      a = randint(-9, 10, [0]);
      b = randint(-9, 10, [0]);
      c = randint(-9, 10, [0]);
      d = randint(-9, 10, [0]);
    } while (a / c === b / d);

    const wrongAnswer = `S=\\left\\{${simplifyNode(
      new FractionNode(new NumberNode(-b), new NumberNode(a)),
    ).toTex()};${simplifyNode(new FractionNode(new NumberNode(-d), new NumberNode(c))).toTex()}\\right\\}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const multiplicationEquation: MathExercise<QCMProps, VEAProps> = {
  id: 'multiplicationEquation',
  connector: '\\iff',
  label: 'Résoudre une équation produit nul',
  levels: ['2nde', '1reESM', '1reSpé', '1reTech'],
  sections: ['Équations'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getMultiplicationEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
