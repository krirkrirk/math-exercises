/*import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DroiteConstructor } from '#root/math/geometry/droite';
import { Point } from '#root/math/geometry/point';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { evaluate } from 'mathjs';

export const derivativeNumberReading2: Exercise = {
  id: 'derivativeNumberReading2',
  connector: '=',
  instruction: '',
  label: 'Lecture de nombre dérivé 2',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getDerivativeNumberReading, nb),
};

export function getDerivativeNumberReading(): Question {
  function computePolynomial(
    x0: number,
    y0: number,
    m: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): [number, number, number, number] {
    const a = (-2 * x0 * x1 * x2 + x0 * x1 * x3 + x0 * x2 * x3 + x1 * x2 * x3) / ((x0 - x1) * (x0 - x2) * (x0 - x3));
    const b =
      ((y0 - y1) / ((x0 - x1) * (x0 - x1)) -
        (y0 - y2) / ((x0 - x2) * (x0 - x2)) +
        (y0 - y3) / ((x0 - x3) * (x0 - x3))) /
      (x0 - x1);
    const c =
      ((m - 2 * a * x0 - b) * (x0 - x1) * (x0 - x2) * (x0 - x3) -
        (y0 - y1) / ((x0 - x1) * (x0 - x1)) +
        a * (x1 * x1 * (x0 - x2) + x2 * x2 * (x0 - x1) - 2 * x1 * x2 * x0) +
        b * (x1 + x2 - 2 * x0)) /
      ((x0 - x2) * (x0 - x3));
    const d = y0 - a * x0 * x0 * x0 - b * x0 * x0 - c * x0;
    return [a, b, c, d];
  }

  function generatePolynomial(
    x0: number,
    y0: number,
    m: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): Polynomial {
    const [a, b, c, d] = computePolynomial(x0, y0, m, x1, y1, x2, y2, x3, y3);
    return new Polynomial([d, c, b, a]);
  }

  const [x1, y1, x2, y2, x3, y3] = [1, 2, 3, 4, 5, 6].map((el) => randint(-5, 6));

  let xA: number, yA, xB, yB: number;
  let pointA, pointB: Point;
  do {
    [xA, yA] = [1, 2].map((el) => randint(-5, 6));
    xB = xA > 0 ? randint(xA - 4, 6) : randint(-4, xA + 5); // l'écart entre les deux points ne soit pas grand
    yB = yA > 0 ? randint(yA - 4, 6) : randint(-4, yA + 5);
    pointA = new Point('A', new NumberNode(xA), new NumberNode(yA));
    pointB = new Point('B', new NumberNode(xB), new NumberNode(yB));
  } while (xB - xA === 0);

  const droite = DroiteConstructor.fromTwoPoints(pointA, pointB, 'D');

  const polynome = generatePolynomial(xA, yA, evaluate(droite.a.toMathString()), x1, y1, x2, y2, x3, y3);

  let instruction = `$f(x) = ${polynome.toTex()}$, $${pointA.toTexWithCoords()}$, $${pointB.toTexWithCoords()}$, $f'(${xA}) = ${droite.getLeadingCoefficient()}$`;

  const question: Question = {
    instruction,
    //startStatement: pointA.toTexWithCoords() + ' ' + pointB.toTexWithCoords(),
    answer: droite.a.toTex(),
  };

  return question;
}
*/
