import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';

export const pythagoreCalcul: Exercise = {
  id: 'pythagoreCalcul',
  connector: '=',
  instruction: '',
  label: 'Utiliser le théoreme de Pythagore pour faire des calculs',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getPythagoreCalcul, nb),
};

export function getPythagoreCalcul(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle(0.7, 1.3, ...vertices);

  const sides = [triangle.getSideCName(), triangle.getSideBName(), triangle.getSideAName()];

  const sideLengths = [triangle.getSideCnumber(), triangle.getSideBnumber(), triangle.getSideAnumber()].map((el) =>
    round(el / 2, 0),
  );

  const rand = randint(0, 3); // valeurs possible : 0 1 2
  const rand2 = randint(0, 3, [rand]); // si rand = 0, valeurs possible 1 2
  const rand3 = randint(0, 3, [rand, rand2]); // valeurs possibles, c'est uniquement ce qui reste des 3 valeurs, une seul valeur possible

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
    ...triangle.generateCommands({
      sideLabels: [...sides, sides[rand3]],
      SetCaption: [...sideLengths.map((el) => el + ''), '?'],
      sideAndColor: [sides[rand3], 'Red'],
    }),
  ];

  const question: Question = {
    instruction: `Dans le triangle ${triangle.getTriangleName()} ci-dessous rectangle en ${triangle.getRightAngle()}, sachant que ${
      sides[rand]
    } = $${sideLengths[rand]}$ et que ${sides[rand2]} = $${sideLengths[rand2]}$.$\\\\$Calculer la longueur exacte ${
      sides[rand3]
    }`,
    startStatement: `${sides[rand3]}`,
    answer: answer + '',
    keys: [],
    commands,
    coords: triangle.generateCoords(),
  };

  return question;
}
