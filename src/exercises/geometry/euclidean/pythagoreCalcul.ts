import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';

export const pythagoreCalcul: Exercise = {
  id: 'pythagoreCalcul',
  connector: '=',
  instruction: '',
  label: 'Utiliser le théoreme de Pythagore pour faire des calculs',
  levels: ['3', '2'],
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
    d1 = Math.hypot(xB - xA, yB - yA);
    yC = yA - ((xB - xA) * (xC - xA)) / (yB - yA);
    d2 = Math.hypot(xC - xA, yC - yA);
  } while (!d1 || !d2 || d1 / d2 < 0.7 || d1 / d2 > 1.3);

  const xMin = Math.min(xA, xB, xC);
  const xMax = Math.max(xA, xB, xC);
  const yMin = Math.min(yA, yB, yC);
  const yMax = Math.max(yA, yB, yC);

  const xOrigin = (xMax + xMin) / 2; // pour que l'affichage soit centré sur notre polygone
  const yOrigin = (yMax + yMin) / 2;

  const ecart = Math.max(yMax - yMin, xMax - xMin) / 2; // pour l'affichage aussi

  const sides = [`${vertices[0]}${vertices[1]}`, `${vertices[2]}${vertices[0]}`, `${vertices[1]}${vertices[2]}`];

  const sideLengths = [d1, d2, Math.hypot(d1, d2)].map((el) => Math.round(el / 2));

  const rand = randint(0, 3); // valeurs possible : 0 1 2
  const rand2 = randint(0, 3, [rand]); // si rand = 0, valeurs possible 1 2
  const rand3 = randint(0, 3, [rand, rand2]); // valeurs possibles, c'est uniquement ce qui reste des 3 valeurs, une seul valeur possible

  const str = 's' + String.fromCharCode(65 + rand3); // variable utile dans les commandes car les segments sont sA, sB ou sC

  let answer;

  if (rand3 === 2) {
    // cas de l'hypoténuse
    answer = Math.hypot(sideLengths[0], sideLengths[1]);
    answer = Math.round(answer) === answer ? answer : `\\sqrt{${sideLengths[0] ** 2 + sideLengths[1] ** 2}}`;
  } else {
    // les deux autres cotés
    answer = Math.sqrt(Math.abs(sideLengths[rand] ** 2 - sideLengths[rand2] ** 2));
    answer =
      Math.round(answer) === answer ? answer : `\\sqrt{${Math.abs(sideLengths[rand] ** 2 - sideLengths[rand2] ** 2)}}`;
  }

  const commands = [
    `${vertices[0]} = Point({${xA}, ${yA}})`,
    `${vertices[1]} = Point({${xB}, ${yB}})`,
    `${vertices[2]} = Point({${xC}, ${yC}})`,
    `sA = Segment(${vertices[0]}, ${vertices[1]})`,
    `sB = Segment(${vertices[0]}, ${vertices[2]})`,
    `sC = Segment(${vertices[1]}, ${vertices[2]})`,
    `ShowAxes(false)`,
    `ShowGrid(false)`,
    `ShowLabel(${vertices[0]}, true)`,
    `ShowLabel(${vertices[1]}, true)`,
    `ShowLabel(${vertices[2]}, true)`,
    `aa = Angle(${vertices[1]},${vertices[0]},${vertices[2]}, Line(${vertices[1]},${vertices[0]}))`,
    `ShowLabel(aa, false)`,
    `ShowLabel(sA, true)`,
    `SetCaption(sA, "${sideLengths[0]}")`,
    `ShowLabel(sB, true)`,
    `SetCaption(sB, "${sideLengths[1]}")`,
    `ShowLabel(sC, true)`,
    `SetCaption(sC, "${sideLengths[2]}")`,
    `SetCaption(${str}, "?")`,
    `SetColor(${str}, "Red")`,
  ];

  const question: Question = {
    instruction: `Dans le triangle ${vertices[0]}${vertices[1]}${vertices[2]} ci-dessous rectangle en ${vertices[0]}, sachant que ${sides[rand]} = $${sideLengths[rand]}$ et que ${sides[rand2]} = $${sideLengths[rand2]}$.$\\\\$Calculer la longueur exacte ${sides[rand3]}`,
    startStatement: `${sides[rand3]}`,
    answer: answer + '',
    keys: [],
    commands,
    coords: [xOrigin - ecart - 1, xOrigin + ecart + 1, yOrigin - ecart - 1, yOrigin + ecart + 1],
  };

  return question;
}
