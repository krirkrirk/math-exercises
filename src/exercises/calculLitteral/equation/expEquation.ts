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
export const expEquation: Exercise = {
  id: 'expEquation',
  connector: '=',
  instruction: '',
  label: 'Résoudre des équations de type $a \\times exp(x) = k$',
  levels: ['1', '0'],
  section: 'Fonction Exponentielle',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpEquation, nb),
  keys: ['exp', 'ln'],
};

export function getExpEquation(): Question {
  const a = randint(-9, 20, [0]);
  const k = a > 0 ? randint(1, 20) : randint(-20, 0);

  const equation = new EqualNode(
    simplifyNode(new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x')))),
    new NumberNode(k),
  );
  const answer = new LogNode(simplifyNode(new FractionNode(new NumberNode(k), new NumberNode(a))));

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
          statement: new LogNode(
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
    answer: answer.toTex(),
    keys: ['exp', 'ln'],
    getPropositions,
  };

  return question;
}
