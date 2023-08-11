import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { LogNode } from '#root/tree/nodes/functions/logNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const logEquation: Exercise = {
  id: 'logEquation',
  connector: '=',
  instruction: '',
  label: 'Résoudre des équations de type a * Ln(x) = k',
  levels: ['1', '0'],
  section: 'Fonction Logarithme népérien',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnEquation, nb),
  keys: ['x'],
};

export function getLnEquation(): Question {
  const a = randint(-9, 20, [0]);
  const k = randint(-9, 20, [0]);

  const equation = new EqualNode(
    simplifyNode(new MultiplyNode(new NumberNode(a), new LogNode(new VariableNode('x')))),
    new NumberNode(k),
  );
  const answer = new ExpNode(simplifyNode(new FractionNode(new NumberNode(k), new NumberNode(a))));

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: answer.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < numOptions - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const randomA = randint(1, 10);
        const randomK = randint(1, 20);

        proposition = {
          id: v4(),
          statement: new ExpNode(
            simplifyNode(new FractionNode(new NumberNode(randomK), new NumberNode(randomA))),
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
    instruction: `Résoudre l'équation $${equation.toTex()}$.`,
    startStatement: 'x',
    answer: answer.toTex(),
    keys: ['x'],
    getPropositions,
  };

  return question;
}
