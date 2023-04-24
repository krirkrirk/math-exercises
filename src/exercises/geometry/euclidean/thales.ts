import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { DroiteConstructor } from '#root/math/geometry/droite';
import { Point } from '#root/math/geometry/point';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { coinFlip } from '#root/utils/coinFlip';

export const thales: Exercise = {
  id: 'thales',
  connector: '=',
  instruction: '',
  label: 'Utiliser le théoreme de Thalès',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie cartésienne',
  generator: (nb: number) => getDistinctQuestions(getThales, nb),
};

export function getThales(): Question {
  const points = [];
  const code = 65 + randint(0, 21);
  for (let i = 0; i < 5; i++) points.push(String.fromCharCode(code + i));
  let a = 0;

  const [xA, yA] = [randint(-10, 11), randint(-10, 11)];
  let xB, yB, xC, yC;

  do {
    xB = randint(-10, 11);
    a++;
  } while (Math.abs(xA - xB) < 2);

  do {
    yB = randint(-10, 11);
    a++;
  } while (Math.abs(yA - yB) < 2);

  do {
    xC = xA + randint(-2, 3, [0]);
    a++;
  } while (Math.abs(xB - xC) < 2);

  do {
    yC = randint(-10, 11, [Math.abs(xA - xC)]);
    a++;
  } while (Math.abs(yA - yC) < 2 || Math.abs(yB - yC) < 2);

  const factor = randint(-5, 6, [-2, -1, 0, 1, 2]) / 10;

  const xD = xA + factor * (xB - xA);
  const yD = yA + factor * (yB - yA);
  const xE = xA + factor * (xC - xA);
  const yE = yA + factor * (yC - yA);

  const xMin = Math.min(xA, xB, xC, xD, xE);
  const xMax = Math.max(xA, xB, xC, xD, xE);
  const yMin = Math.min(yA, yB, yC, yD, yE);
  const yMax = Math.max(yA, yB, yC, yD, yE);

  const commands = [
    `${points[0]} = Point({${xA}, ${yA}})`,
    `${points[1]} = Point({${xB}, ${yB}})`,
    `${points[2]} = Point({${xC}, ${yC}})`,
    `${points[3]} = Point(${points[0]}, Vector(${factor}Vector(${points[0]},${points[1]})))`,
    `${points[4]} = Intersect(Line(${points[3]}, Line(${points[1]}, ${points[2]})) , Line(${points[0]}, ${points[2]}))`,
    `l = Segment(${points[0]}, ${points[1]})`,
    `i = Segment(${points[0]}, ${points[2]})`,
    `j = Segment(${points[1]}, ${points[2]})`,
    `k = Segment(${points[3]}, ${points[4]})`,
    `If(${factor} < 0, Segment(${points[0]}, ${points[3]}))`,
    `If(${factor} < 0, Segment(${points[0]}, ${points[4]}))`,
    `ShowAxes(true)`,
    `ShowGrid(true)`,
    `ShowLabel(${points[0]}, true)`,
    `ShowLabel(${points[1]}, true)`,
    `ShowLabel(${points[2]}, true)`,
    `ShowLabel(${points[3]}, true)`,
    `ShowLabel(${points[4]}, true)`,
  ];

  const question: Question = {
    instruction: `${a}`,
    answer: `${a}` + 'cc',
    keys: [],
    commands,
    coords: [xMin - 1, xMax + 1, yMin - 1, yMax + 1],
  };

  return question;
}
