/*import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const pythagore: Exercise = {
  id: 'pythagore',
  connector: '=',
  instruction: "Écrire l'égalité de Pythagore pour la figure suivante : ",
  label: 'Utiliser le théoreme de Pythagore',
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getPythagore, nb),
};

export function getPythagore(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const [xA, yA] = [randint(-10, 11), randint(-10, 11)];
  let xB, yB, xC, yC;
  let d1, d2; // distance entre le point A et B

  do {
    [xB, yB, xC] = [randint(-10, 11), randint(-10, 11), randint(-10, 11)];
    d1 = Math.hypot(xB - xA, yB - yA); // Calculer la distance entre A et B
    yC = yA - ((xB - xA) * (xC - xA)) / (yB - yA);
    d2 = Math.hypot(xC - xA, yC - yA); // Calculer la distance entre A et C
  } while (!d1 || !d2 || d1 / d2 < 0.7 || d1 / d2 > 1.3);

  const xMin = Math.min(xA, xB, xC);
  const xMax = Math.max(xA, xB, xC);
  const yMin = Math.min(yA, yB, yC);
  const yMax = Math.max(yA, yB, yC);

  const xOrigin = (xMax + xMin) / 2; // pour que l'affichage soit centré sur notre polygone
  const yOrigin = (yMax + yMin) / 2;

  const ecart = Math.max(yMax - yMin, xMax - xMin) / 2; // affichage aussi

  const commands = [
    `${vertices[0]} = Point({${xA}, ${yA}})`,
    `${vertices[1]} = Point({${xB}, ${yB}})`,
    `${vertices[2]} = Point({${xC}, ${yC}})`,
    `Polygon(${vertices[0]}, ${vertices[1]}, ${vertices[2]})`,
    `ShowAxes(false)`,
    `ShowGrid(false)`,
    `ShowLabel(${vertices[0]}, true)`,
    `ShowLabel(${vertices[1]}, true)`,
    `ShowLabel(${vertices[2]}, true)`,
    `aa = Angle(${vertices[1]},${vertices[0]},${vertices[2]}, Line(${vertices[1]},${vertices[0]}))`,
    `ShowLabel(aa, false)`,
  ];

  const question: Question = {
    answer: `${vertices[1]}${vertices[2]}^2 = ${vertices[0]}${vertices[2]}^2 + ${vertices[0]}${vertices[1]}^2`,
    keys: [...vertices, 'equal'],
    commands,
    coords: [xOrigin - ecart - 1, xOrigin + ecart + 1, yOrigin - ecart - 1, yOrigin + ecart + 1],
  };

  return question;
}
*/
