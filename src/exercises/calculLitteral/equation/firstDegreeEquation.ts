import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const firstDegreeEquation: Exercise = {
  id: 'firstDegreeEquation',
  connector: '=',
  instruction: '',
  label: 'Résoudre une équation du premier degré du type $\\frac{a}{x} = b$',
  levels: ['2', '1'],
  section: 'Équations',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstDegreeEquation, nb),
  keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
};

export function getFirstDegreeEquation(): Question {
  const a = randint(-30, 30, [0]);
  const b = randint(-30, 30, [0]);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: simplifyNode(new NumberNode(a / b)).toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: simplifyNode(new NumberNode((a + randint(-7, 8, [-a])) / (b + randint(-7, 8, [-b])))).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Résoudre l'équation suivante : $\\frac{${a}}{x} = ${b}$`,
    startStatement: `x`,
    answer: simplifyNode(new NumberNode(a / b)).toTex(),
    keys: ['x', 'S', 'equal', 'lbrace', 'rbrace', 'semicolon', 'emptyset'],
    getPropositions,
  };

  return question;
}
