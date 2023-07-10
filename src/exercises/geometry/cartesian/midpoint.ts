import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Point } from '#root/math/geometry/point';
import { distinctRandTupleInt } from '#root/math/utils/random/randTupleInt';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const midpoint: Exercise = {
  id: 'midpoint',
  connector: '=',
  instruction: '',
  label: 'Coordonnées du milieu',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getMidpointQuestion, nb),
  keys: ['semicolon'],
};

export function getMidpointQuestion(): Question {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
  const A = new Point('A', new NumberNode(coords1[0]), new NumberNode(coords1[1]));
  const B = new Point('B', new NumberNode(coords2[0]), new NumberNode(coords2[1]));

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: A.midpoint(B).toTexWithCoords(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const [tempCoords1, tempsCoords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
        const temps1 = new Point('A', new NumberNode(tempCoords1[0]), new NumberNode(tempCoords1[1]));
        const temps2 = new Point('B', new NumberNode(tempsCoords2[0]), new NumberNode(tempsCoords2[1]));
        const wrongAnswer = temps1.midpoint(temps2);
        proposition = {
          id: v4() + '',
          statement: wrongAnswer.toTexWithCoords(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Soit $${A.toTexWithCoords()}$ et $${B.toTexWithCoords()}$. Quelles sont les coordonnées du milieu $I$ de $[AB]$ ?`,
    startStatement: 'I',
    answer: A.midpoint(B).toTexWithCoords(),
    keys: ['semicolon'],
    getPropositions,
  };
  return question;
}
