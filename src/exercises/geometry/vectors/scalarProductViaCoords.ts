import { Exercise, Question, Proposition } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Vector } from '#root/math/geometry/vector';
import { distinctRandTupleInt } from '#root/math/utils/random/randTupleInt';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const scalarProductViaCoords: Exercise = {
  id: 'scalarProductViaCoords',
  connector: '=',
  instruction: '',
  isSingleStep: false,
  label: "Calculer un produit scalaire à l'aide des coordonnées",
  levels: ['1, 0'],
  section: 'Vecteurs',
  generator: (nb: number) => getDistinctQuestions(getScalarProductViaCoordsQuestion, nb),
  keys: [],
};

export function getScalarProductViaCoordsQuestion(): Question {
  const [coords1, coords2] = distinctRandTupleInt(2, 2, { from: -9, to: 10 });
  const u = new Vector('u', new NumberNode(coords1[0]), new NumberNode(coords1[1]));
  const v = new Vector('v', new NumberNode(coords2[0]), new NumberNode(coords2[1]));

  const correctAnswer = u.scalarProduct(v).toTex();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: correctAnswer,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: randint(-100, 100, [0]) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  return {
    instruction: `Soit $${u.toTexWithCoords()}$ et $${v.toTexWithCoords()}$. Calculer $${u.toTex()}\\cdot ${v.toTex()}$.`,
    startStatement: `${u.toTex()}\\cdot ${v.toTex()}`,
    answer: correctAnswer,
    keys: [],
    getPropositions,
  };
}
