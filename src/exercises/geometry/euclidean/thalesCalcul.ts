import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';

export const thalesCalcul: Exercise = {
  id: 'thalesCalcul',
  connector: '=',
  instruction: '',
  label: 'Utiliser le théoreme de Thalès pour faire des calculs',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getThales, nb),
};

export function getThales(): Question {
  const points = [];
  const code = 65 + randint(0, 22);
  for (let i = 0; i < 5; i++) points.push(String.fromCharCode(code + i));

  const [xA, yA] = [randint(-10, 11), randint(-10, 11)];
  let xB, yB, xC, yC;
  let d1, d2, d3; // distance entre le point A et B
  let theta = 0; // angle entre AB et AC

  do {
    [xB, yB, xC, yC] = [randint(-10, 11), randint(-10, 11), randint(-10, 11), randint(-10, 11)];
    d1 = Math.sqrt((xB - xA) ** 2 + (yB - yA) ** 2);
    d2 = Math.sqrt((xC - xA) ** 2 + (yC - yA) ** 2);
    theta = Math.acos(((xB - xA) * (xC - xA) + (yB - yA) * (yC - yA)) / (d1 * d2));
  } while (!theta || theta < 0.35 || theta > 2.1 || d1 / d2 > 1.3 || d1 / d2 < 0.7);

  d3 = Math.sqrt(d1 ** 2 + d2 ** 2 - 2 * d1 * d2 * Math.cos(theta));

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
    `ShowAxes(false)`,
    `ShowGrid(false)`,
    `ShowLabel(${points[0]}, true)`,
    `ShowLabel(${points[1]}, true)`,
    `ShowLabel(${points[2]}, true)`,
    `ShowLabel(${points[3]}, true)`,
    `ShowLabel(${points[4]}, true)`,
  ];

  const droites = [
    `${points[0]}${points[1]}`,
    `${points[0]}${points[3]}`,
    `${points[0]}${points[2]}`,
    `${points[0]}${points[4]}`,
    `${points[1]}${points[2]}`,
    `${points[3]}${points[4]}`,
  ];

  const length = [d1, factor * d1, d2, factor * d2, d3, factor * d3].map((el) => Math.round(Math.abs(el)));

  const rand = randint(0, 3);
  let rand2 = randint(0, 3, [rand]);
  if (length[2 * rand] === length[2 * rand2]) rand2 = randint(0, 3, [rand, rand2]);

  let instruction = `Dans la figure ci-dessous, nous avons (${points[3]}${points[4]})//(${points[1]}${points[2]}), `;
  let statement;

  if (coinFlip()) {
    instruction += `${droites[2 * rand]} = $${length[2 * rand]}$, ${droites[2 * rand + 1]} = $${
      length[2 * rand + 1]
    }$, ${droites[2 * rand2]} = $${length[2 * rand2]}$.$\\\\$Déterminer ${droites[2 * rand2 + 1]}`;

    statement = simplifyNode(
      new FractionNode(new NumberNode(length[2 * rand2] * length[2 * rand + 1]), new NumberNode(length[2 * rand])),
    );
  } else {
    instruction += `${droites[2 * rand]} = $${length[2 * rand]}$, ${droites[2 * rand + 1]} = $${
      length[2 * rand + 1]
    }$, ${droites[2 * rand2 + 1]} = $${length[2 * rand2 + 1]}$.$\\\\$Déterminer ${droites[2 * rand2]}`;

    statement = simplifyNode(
      new FractionNode(new NumberNode(length[2 * rand2 + 1] * length[2 * rand]), new NumberNode(length[2 * rand + 1])),
    );
  }

  const question: Question = {
    instruction,
    answer: statement.toTex(),
    keys: [],
    commands,
    coords: [xMin - 1, xMax + 1, yMin - 1, yMax + 1],
  };

  return question;
}
