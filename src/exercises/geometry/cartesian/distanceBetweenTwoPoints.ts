import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Point } from '#root/math/geometry/point';
import { SquareRoot } from '#root/math/numbers/reals/real';
import { distinctRandTupleInt } from '#root/math/utils/random/randTupleInt';
import { round } from '#root/math/utils/round';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const distanceBetweenTwoPoints: MathExercise = {
  id: 'distanceBetweenTwoPoints',
  connector: '=',
  instruction: '',
  label: 'Distance entre deux points',
  levels: ['2nde', '1reESM'],
  sections: ['Géométrie cartésienne'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getDistanceBetweenTwoPoints, nb),
  keys: [],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDistanceBetweenTwoPoints(): Question {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
  let A = new Point('A', new NumberNode(coords1[0]), new NumberNode(coords1[1]));
  let B = new Point('B', new NumberNode(coords2[0]), new NumberNode(coords2[1]));

  const answer = new SquareRoot(round(A.distanceTo(B) ** 2, 0)).simplify().toTree().toTex();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    let isDuplicate: boolean;
    let temp = n;

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    temp--;

    A = new Point('A', new NumberNode(coords1[0]), new NumberNode(coords1[1]));
    B = new Point('B', new NumberNode(-coords2[0]), new NumberNode(-coords2[1]));
    let wrongStatement = new SquareRoot(round(A.distanceTo(B) ** 2, 0)).simplify().toTree().toTex();
    isDuplicate = res.some((p) => p.statement === wrongStatement);

    if (!isDuplicate) {
      res.push({
        id: v4() + '',
        statement: wrongStatement,
        isRightAnswer: false,
        format: 'tex',
      });
      temp--;
    }

    A = new Point('A', new NumberNode(coords1[1]), new NumberNode(coords1[0]));
    B = new Point('B', new NumberNode(coords2[0]), new NumberNode(coords2[1]));
    wrongStatement = new SquareRoot(round(A.distanceTo(B) ** 2, 0)).simplify().toTree().toTex();
    isDuplicate = res.some((p) => p.statement === wrongStatement);

    if (n > 0 && !isDuplicate) {
      res.push({
        id: v4() + '',
        statement: wrongStatement,
        isRightAnswer: false,
        format: 'tex',
      });
      temp--;
    }

    A = new Point('A', new NumberNode(coords1[0]), new NumberNode(coords2[0]));
    B = new Point('B', new NumberNode(coords1[1]), new NumberNode(coords2[1]));
    wrongStatement = new SquareRoot(round(A.distanceTo(B) ** 2, 0)).simplify().toTree().toTex();
    isDuplicate = res.some((p) => p.statement === wrongStatement);

    if (n > 0 && !isDuplicate) {
      res.push({
        id: v4() + '',
        statement: wrongStatement,
        isRightAnswer: false,
        format: 'tex',
      });
      temp--;
    }

    for (let i = 0; i < temp; i++) {
      let proposition: Proposition;

      do {
        const [tempCoords1, tempsCoords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
        const A = new Point('A', new NumberNode(tempCoords1[0]), new NumberNode(tempCoords1[1]));
        const B = new Point('B', new NumberNode(tempsCoords2[0]), new NumberNode(tempsCoords2[1]));
        proposition = {
          id: v4() + '',
          statement: new SquareRoot(round(A.distanceTo(B) ** 2, 0)).simplify().toTree().toTex(),
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
      temp--;
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Soit $${A.toTexWithCoords()}$ et $${B.toTexWithCoords()}$. Calculer la distance $AB$.`,
    startStatement: 'AB',
    answer,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };
  return question;
}
