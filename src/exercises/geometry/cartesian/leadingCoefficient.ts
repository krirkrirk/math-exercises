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

  let instruction = `Quel est le coefficient directeur de la droite suivante`;

  let xmin, xmax, ymin, ymax: number;

  if (eval(droite.b.toMathString()) > 0) {
    ymax = eval(droite.b.toMathString()) + 1;
    ymin = -1;
  } else {
    ymin = eval(droite.b.toMathString()) - 1;
    ymax = 1;
  }

  if (-eval(droite.b.toMathString()) / eval(droite.a.toMathString()) > 0) {
    xmax = -eval(droite.b.toMathString()) / eval(droite.a.toMathString()) + 1;
    xmin = -1;
  } else {
    xmin = -eval(droite.b.toMathString()) / eval(droite.a.toMathString()) - 1;
    xmax = 1;
  }

  const question: Question = {
    instruction,
    startStatement: droite.toEquationExpression(),
    answer: droite.getLeadingCoefficient(),
    keys: [],
    commands: [`f(x) = (${droite.a.toMathString()}) * x + (${droite.b.toMathString()})`],
    coords: [xmin, xmax, ymin, ymax],
  };

  return question;
}
