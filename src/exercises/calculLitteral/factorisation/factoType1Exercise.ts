/**
 *  type (ax+b)(cx+d) ± (ax+b)(ex+f)
 */

import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Affine, AffineConstructor } from '#root/math/polynomials/affine';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { random } from '#root/utils/random';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const factoType1Exercise: Exercise = {
  id: 'facto1',
  connector: '=',
  instruction: 'Factoriser :',
  isSingleStep: false,
  label: 'Factorisation du type $(ax+b)(cx+d) \\pm (ax+b)(ex+f)$',
  levels: ['3', '2'],
  section: 'Calcul littéral',
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
  keys: ['x'],
};

export function getFactoType1Question(): Question {
  const affines = AffineConstructor.differentRandoms(3);

  const permut: Affine[][] = [shuffle([affines[0], affines[1]]), shuffle([affines[0], affines[2]])];

  const operation = random(['add', 'substract']);

  const statementTree =
    operation === 'add'
      ? new AddNode(
          new MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()),
          new MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree()),
        )
      : new SubstractNode(
          new MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()),
          new MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree()),
        );

  const answerTree = new MultiplyNode(
    affines[0].toTree(),
    affines[1].add(operation === 'add' ? affines[2] : affines[2].opposite()).toTree(),
  );

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answerTree.toTex(),
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement: new MultiplyNode(
        affines[0].toTree(),
        affines[1].add(operation !== 'add' ? affines[2] : affines[2].opposite()).toTree(),
      ).toTex(),
      isRightAnswer: false,
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: new MultiplyNode(
          affines[1].toTree(),
          affines[0].add(operation === 'add' ? affines[2] : affines[2].opposite()).toTree(),
        ).toTex(),
        isRightAnswer: false,
      });

    if (n > 3)
      res.push({
        id: v4() + '',
        statement: new MultiplyNode(
          affines[2].toTree(),
          affines[0].add(operation === 'add' ? affines[2] : affines[2].opposite()).toTree(),
        ).toTex(),
        isRightAnswer: false,
      });

    for (let i = 0; i < n - 4; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new MultiplyNode(
          affines[0].toTree(),
          affines[1].add(AffineConstructor.differentRandoms(1)[0]).toTree(),
        );

        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    startStatement: statementTree.toTex(),
    answer: answerTree.toTex(),
    keys: ['x'],
    getPropositions,
  };
  return question;
}
