import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';

export const rightTriangleArea: Exercise = {
  id: 'rightTriangleArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un triangle rectangle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getRightTriangleArea, nb),
};

export function getRightTriangleArea(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({ minRapport: 0.4, maxRapport: 1.6, names: vertices });

  const sidesLength = [Math.round(triangle.getSideBnumber() / 2), Math.round(triangle.getSideCnumber() / 2)];

  const commands = [
    ...triangle.generateCommands({
      showLabels: [triangle.getSideBName(), triangle.getSideCName()],
      setCaptions: [sidesLength[0] + '', sidesLength[1] + ''],
    }),
  ];

  const question: Question = {
    instruction: `Calculer l'aire du triangle ${triangle.getTriangleName()} rectangle en ${triangle.getRightAngle()} sachant que ${triangle.getSideBName()} = $${
      sidesLength[0]
    }$ cm et ${triangle.getSideCName()} = $${sidesLength[1]}$ cm.`,
    answer: (sidesLength[0] * sidesLength[1]) / 2 + '',
    keys: [...vertices, 'equal', 'cm2'],
    commands,
    coords: triangle.generateCoords(),
  };

  return question;
}
