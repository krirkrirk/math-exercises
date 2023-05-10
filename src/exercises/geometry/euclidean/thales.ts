import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const thales: Exercise = {
  id: 'thales',
  connector: '=',
  instruction: '',
  label: "Ecrire l'égalité de Thalès",
  levels: ['5', '4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getThales, nb),
};

export function getThales(): Question {
  const vertices = [];
  const code = 65 + randint(0, 22); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 5; i++) vertices.push(String.fromCharCode(code + i));

  const [xA, yA] = [randint(-10, 11), randint(-10, 11)];
  let xB, yB, xC, yC;
  let d1, d2; // distance entre le point A et B
  let theta = 0; // angle entre AB et AC

  do {
    [xB, yB, xC, yC] = [randint(-10, 11), randint(-10, 11), randint(-10, 11), randint(-10, 11)];
    d1 = Math.hypot(xB - xA, yB - yA); // Calculer la distance entre A et B
    d2 = Math.hypot(xC - xA, yC - yA); // Calculer la distance entre A et C
    theta = Math.acos(((xB - xA) * (xC - xA) + (yB - yA) * (yC - yA)) / (d1 * d2));
  } while (!theta || theta < 0.35 || theta > 2.1 || d1 / d2 > 1.3 || d1 / d2 < 0.7);

  const factor = randint(-5, 6, [-2, -1, 0, 1, 2]) / 10; // facteur = AB/AE, Pour que l'affichage soit acceptable, les valeurs de factor sont +- 0.5 0.4 0.3

  const [xD, yD] = [xA + factor * (xB - xA), yA + factor * (yB - yA)];
  const [xE, yE] = [xA + factor * (xC - xA), yA + factor * (yC - yA)];

  const xMin = Math.min(xA, xB, xC, xD, xE);
  const xMax = Math.max(xA, xB, xC, xD, xE);
  const yMin = Math.min(yA, yB, yC, yD, yE);
  const yMax = Math.max(yA, yB, yC, yD, yE);

  const commands = [
    `${vertices[0]} = Point({${xA}, ${yA}})`,
    `${vertices[1]} = Point({${xB}, ${yB}})`,
    `${vertices[2]} = Point({${xC}, ${yC}})`,
    `${vertices[3]} = Point(${vertices[0]}, Vector(${factor}Vector(${vertices[0]},${vertices[1]})))`,
    `${vertices[4]} = Intersect(Line(${vertices[3]}, Line(${vertices[1]}, ${vertices[2]})) , Line(${vertices[0]}, ${vertices[2]}))`,
    `l = Segment(${vertices[0]}, ${vertices[1]})`,
    `i = Segment(${vertices[0]}, ${vertices[2]})`,
    `j = Segment(${vertices[1]}, ${vertices[2]})`,
    `k = Segment(${vertices[3]}, ${vertices[4]})`,
    `If(${factor} < 0, Segment(${vertices[0]}, ${vertices[3]}))`,
    `If(${factor} < 0, Segment(${vertices[0]}, ${vertices[4]}))`,
    `ShowAxes(false)`,
    `ShowGrid(false)`,
    `ShowLabel(${vertices[0]}, true)`,
    `ShowLabel(${vertices[1]}, true)`,
    `ShowLabel(${vertices[2]}, true)`,
    `ShowLabel(${vertices[3]}, true)`,
    `ShowLabel(${vertices[4]}, true)`,
  ];

  const question: Question = {
    instruction: `En utilisant le théoreme de Thalès, Écrire l'égalité des quotients sachant que :$\\\\$ (${vertices[3]}${vertices[4]})//(${vertices[1]}${vertices[2]})`,
    answer: `\\frac{${vertices[0]}${vertices[3]}}{${vertices[0]}${vertices[1]}} = \\frac{${vertices[0]}${vertices[4]}}{${vertices[0]}${vertices[2]}} = \\frac{${vertices[3]}${vertices[4]}}{${vertices[1]}${vertices[2]}}`,
    keys: [...vertices, 'equal'],
    commands,
    coords: [xMin - 1, xMax + 1, yMin - 1, yMax + 1],
  };

  return question;
}
