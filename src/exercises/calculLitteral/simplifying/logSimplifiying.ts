import { Exercise, Proposition, Question } from '#root/exercises/exercise';
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

export const logSimplifiying: Exercise = {
  id: 'logSimplifiying',
  connector: '\\iff',
  instruction: '',
  label: 'Simplifier des expressions avec $ln$',
  levels: ['1', '0'],
  section: 'Fonction Logarithme népérien',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpSimplifiying, nb),
  keys: ['ln'],
};

export function getExpSimplifiying(): Question {
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

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: simplifiedExpression.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const a = randint(1, 10);
        const b = randint(1, 10);
        proposition = {
          id: v4(),
          statement:
            pm > 0
              ? new LogNode(new NumberNode(a * b)).toTex()
              : new LogNode(simplifyNode(new NumberNode(a / b))).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Simplifier l'expression $${expression.toTex()}$.`,
    answer: simplifiedExpression.toTex(),
    keys: ['ln'],
    getPropositions,
  };

  return question;
}
