import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';

export const trigonometrySideCalcul: Exercise = {
  id: 'trigonometrySideCalcul',
  connector: '=',
  instruction: '',
  label: 'Calculer une longueur dans un triangle rectangle',
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTrigonometrySideCalcul, nb),
};

export function getTrigonometrySideCalcul(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle(0.5, 1.5, ...vertices);

  const sides = [triangle.getSideCName(), triangle.getSideBName(), triangle.getSideAName()];

  const sideLengths = [triangle.getSideCnumber(), triangle.getSideBnumber(), triangle.getSideAnumber()].map((el) =>
    round(el / 2, 2),
  );

  const angle = [triangle.vertexB.name, triangle.vertexC.name];

  const randAngle = randint(0, 2);
  const randside = randint(0, 3); // valeurs possible : 0 1 2
  const randsideQuestion = randint(0, 3, [randside]); // si rand = 0, valeurs possible 1 2

  const angleValue = [
    round((Math.acos(sideLengths[0] / sideLengths[2]) * 180) / Math.PI, 1),
    round((Math.acos(sideLengths[1] / sideLengths[2]) * 180) / Math.PI, 1),
  ];

  const commands = [
    ...triangle.generateCommands({
      angle: angle[randAngle],
      colorAngle: 'Black',
      sideLabels: [sides[randsideQuestion]],
      SetCaption: ['?'],
      sideAndColor: [sides[randsideQuestion], 'Red'],
    }),
  ];

  const question: Question = {
    instruction: `Le triangle ${triangle.getTriangleName()} rectanble en ${triangle.getRightAngle()} tel que ${
      sides[randside]
    } = $${sideLengths[randside]}$ cm et $\\widehat{${angle[randAngle]}}$ = $${
      angleValue[randAngle]
    }$°.$\\\\$ Calculer ${sides[randsideQuestion]} à $0,1$ cm près.`,
    answer: `${round(sideLengths[randsideQuestion], 1)}`,
    keys: [...vertices, 'equal'],
    commands,
    coords: triangle.generateCoords(),
  };

  return question;
}
