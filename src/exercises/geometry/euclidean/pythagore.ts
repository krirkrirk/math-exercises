import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const pythagore: Exercise = {
  id: 'pythagore',
  connector: '=',
  instruction: '',
  label: 'Utiliser le théoreme de Pythagore',
  levels: ['3', '2', '1'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getPythagore, nb),
};

export function getPythagore(): Question {
  const points = [];
  const code = 65 + randint(0, 24);
  for (let i = 0; i < 3; i++) points.push(String.fromCharCode(code + i));

  const [xA, yA] = [randint(-10, 11), randint(-10, 11)];
  let xB, yB, xC, yC;
  let d1, d2; // distance entre le point A et B
  let theta = 0; // angle entre AB et AC

  do {
    [xB, yB, xC] = [randint(-10, 11), randint(-10, 11), randint(-10, 11)];
    d1 = Math.sqrt((xB - xA) ** 2 + (yB - yA) ** 2);
    yC = yA - ((xB - xA) * (xC - xA)) / (yB - yA);
    d2 = Math.sqrt((xC - xA) ** 2 + (yC - yA) ** 2);
  } while (!d1 || d1 / d2 < 0.7 || d1 / d2 > 1.3);

  theta = Math.acos(((xB - xA) * (xC - xA) + (yB - yA) * (yC - yA)) / (d1 * d2));

  const Min = Math.min(xA, xB, xC, yA, yB, yC);
  const Max = Math.max(xA, xB, xC, yA, yB, yC);
  const orthonorme = Math.max(Math.abs(Min), Math.abs(Max));

  const commands = [
    `${points[0]} = Point({${xA}, ${yA}})`,
    `${points[1]} = Point({${xB}, ${yB}})`,
    `${points[2]} = Point({${xC}, ${yC}})`,
    `Polygon(${points[0]}, ${points[1]}, ${points[2]})`,
    `ShowAxes(false)`,
    `ShowGrid(false)`,
    `ShowLabel(${points[0]}, true)`,
    `ShowLabel(${points[1]}, true)`,
    `ShowLabel(${points[2]}, true)`,
  ];

  const question: Question = {
    instruction: `En utilisant le théoreme de Thalès, Écrire l'égalité des quotients sachant que :$\\\\$ (${points[3]}${points[4]})//(${points[1]}${points[2]})`,
    startStatement: `${theta}`,
    answer: `\\frac{${points[0]}${points[3]}}{${points[0]}${points[1]}} = \\frac{${points[0]}${points[4]}}{${points[0]}${points[2]}} = \\frac{${points[3]}${points[4]}}{${points[1]}${points[2]}}`,
    keys: [],
    commands,
    coords: [-orthonorme, orthonorme, -orthonorme, orthonorme],
  };

  return question;
}
