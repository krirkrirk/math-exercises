import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DroiteConstructor } from '#root/math/geometry/droite';
import { Point } from '#root/math/geometry/point';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { evaluate } from 'mathjs';

export const derivativeNumberReading: Exercise = {
  id: 'derivativeNumberReading',
  connector: '=',
  instruction: '',
  label: 'Lecture de nombre dérivé',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getDerivativeNumberReading, nb),
};

export function getDerivativeNumberReading(): Question {
  /*let xA = randint(-4, 5);
  let polynome: Polynomial;
  let yA: number;

  do {
    polynome = new Polynomial([randint(-4, 5), randint(-4, 5), randint(-4, 5), randint(-4, 5, [0])]);
    yA = polynome.coefficients[0];
    for (let index = 1; index < 4; index++) yA += polynome.coefficients[index] * Math.pow(xA, index);
  } while (yA < -5 || yA > 5);

  const pointA = new Point('A', new NumberNode(xA), new NumberNode(yA));
  const slope = polynome.derivate().coefficients[2] * xA;
  const droite = DroiteConstructor.fromPointAndSlope(pointA, new NumberNode(slope));

  let instruction = `$f(x) = ${polynome}$, $${pointA.toTexWithCoords()}$, $f'(${xA}) = ${slope}$`;
*/

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

  const [a, b] = [(3 * randint(-100, 100, [0])) / 100, (2 * randint(-4, 5)) / 100];

  const c = evaluate(droite.a.toMathString()) - a * Math.pow(xA, 2) - b * xA;
  const d = yA - (a / 3) * Math.pow(xA, 3) - (b / 2) * Math.pow(xA, 2) - xA * c;

  const polynome = new Polynomial([d, c, b / 2, a / 3]);

  let instruction = `$f(x) = ${polynome.toTex()}$, $${pointA.toTexWithCoords()}$, $${pointB.toTexWithCoords()}$, $f'(${xA}) = ${droite.getLeadingCoefficient()}$`;

  const question: Question = {
    instruction,
    //startStatement: 'a',
    answer: droite.getLeadingCoefficient(),
    commands: [
      polynome.toString(),
      `g(x) = (${droite.a.toMathString()}) * x + (${droite.b.toMathString()})`,
      `(${xA},${yA})`,
    ],
    coords: [xA - 5, xA + 5, yA - 5, yA + 5],
  };

  return question;
}
