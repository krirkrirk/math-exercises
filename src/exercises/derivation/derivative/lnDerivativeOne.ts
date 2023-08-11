import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const lnDerivativeOne: Exercise = {
  id: 'lnDerivativeOne',
  connector: '=',
  instruction: '',
  label: 'Dérivée de Ln(ax + b)',
  levels: ['1', '0'],
  section: 'Fonction Logarithme népérien',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnDerivative, nb),
  keys: ['x'],
};

export function getLnDerivative(): Question {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const derivative = simplifyNode(new FractionNode(new NumberNode(a), new Polynomial([b, a]).toTree()));

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: derivative.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const randomA = randint(-9, 10, [0]);
        const randomB = randint(-9, 10);

        proposition = {
          id: v4(),
          statement: simplifyNode(
            new FractionNode(new NumberNode(randomA), new Polynomial([randomB, randomA]).toTree()),
          ).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = \\ln(${new Polynomial([b, a])})$.`,
    startStatement: "f'(x)",
    answer: derivative.toTex(),
    keys: ['x'],
    getPropositions,
  };

  return question;
}
