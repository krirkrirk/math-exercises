import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DroiteConstructor } from '#root/math/geometry/droite';
import { Point } from '#root/math/geometry/point';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';

export const leadingCoefficient: Exercise = {
  id: 'leadingCoefficient',
  connector: '=',
  instruction: '',
  label: 'Déterminer le coefficient directeur',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getLeadingCoefficientQuestion, nb),
};

export function getLeadingCoefficientQuestion(): Question {
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

  let instruction = `Quel est le coefficient directeur de la droite $${droite.toEquationExpression()}$`;

  const question: Question = {
    instruction,
    //startStatement: pointA.toTexWithCoords() + ' ' + pointB.toTexWithCoords(),
    answer: droite.getLeadingCoefficient(),
  };

  return question;
}
