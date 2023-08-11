import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const geometricFindExplicitFormula: Exercise = {
  id: 'geometricFindExplicitFormula',
  connector: '=',
  instruction: '',
  label: "Déterminer la formule générale d'une suite géométrique",
  levels: ['1', '0'],
  isSingleStep: false,
  section: 'Suites',
  generator: (nb: number) => getDistinctQuestions(getGeometricFindExplicitFormula, nb),
  keys: ['q', 'n', 'u', 'underscore'],
};

export function getGeometricFindExplicitFormula(): Question {
  const firstRank = 0;
  const firstValue = randint(1, 10);
  const reason = randint(2, 10);

  const formula = new MultiplyNode(
    new NumberNode(firstValue),
    new PowerNode(new NumberNode(reason), new VariableNode('n')),
  );

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: simplifyNode(formula).toTex(),
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement: simplifyNode(
        new MultiplyNode(new NumberNode(reason), new PowerNode(new NumberNode(firstValue), new VariableNode('n'))),
      ).toTex(),
      isRightAnswer: false,
    });

    for (let i = 0; i < n - 2; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new MultiplyNode(
          new NumberNode(firstValue + randint(-firstValue, 2 * firstValue + 1)),
          new PowerNode(new NumberNode(reason + +randint(-reason + 1, 2 * reason + 1)), new VariableNode('n')),
        );
        proposition = {
          id: v4() + '',
          statement: simplifyNode(wrongAnswer).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `$(u_n)$ est une suite géométrique de premier terme $u_{${firstRank}} = ${firstValue}$ et de raison $q = ${reason}$. $\\\\$ Donner l'expression de $u_n$ en fonction de $n$.`,
    startStatement: 'u_n',
    answer: simplifyNode(formula).toTex(),
    keys: ['q', 'n', 'u', 'underscore'],
    getPropositions,
  };
  return question;
}
