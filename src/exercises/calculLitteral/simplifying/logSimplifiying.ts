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
import { randint } from '#root/math/utils/random/randint';
import { LogNode } from '#root/tree/nodes/functions/logNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  pm: number;
};
type VEAProps = {};

const getExpSimplifiying: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(1, 10);
  const b = randint(1, 10);

  let expression;
  let simplifiedExpression: LogNode;
  let pm = 0;

  if (coinFlip()) {
    expression = new AddNode(new LogNode(new NumberNode(a)), new LogNode(new NumberNode(b)));
    simplifiedExpression = new LogNode(new NumberNode(a * b));
    pm = 1;
  } else {
    expression = new SubstractNode(new LogNode(new NumberNode(a)), new LogNode(new NumberNode(b)));
    simplifiedExpression = new LogNode(simplifyNode(new NumberNode(a / b)));
    pm = -1;
  }

  const answer = simplifiedExpression.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Simplifier l'expression $${expression.toTex()}$.`,
    answer,
    keys: ['ln'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, pm },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, pm }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const a = randint(1, 10);
    const b = randint(1, 10);
    tryToAddWrongProp(
      propositions,
      pm > 0 ? new LogNode(new NumberNode(a * b)).toTex() : new LogNode(simplifyNode(new NumberNode(a / b))).toTex(),
    );
  }

  return shuffle(propositions);
};

export const logSimplifiying: MathExercise<QCMProps, VEAProps> = {
  id: 'logSimplifiying',
  connector: '\\iff',
  label: 'Simplifier des expressions avec $\\ln$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  sections: ['Logarithme népérien'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpSimplifiying, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
