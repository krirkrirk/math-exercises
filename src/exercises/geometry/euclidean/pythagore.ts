import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';

export const pythagore: Exercise = {
  id: 'pythagore',
  connector: '=',
  instruction: "Écrire l'égalité de Pythagore pour la figure suivante : ",
  label: "Ecrire l'égalité de Pythagore",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getPythagore, nb),
};

export function getPythagore(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({ minRapport: 0.7, maxRapport: 1.3, names: vertices });

  const question: Question = {
    answer: `${triangle.getSideAName()}^2 = ${triangle.getSideBName()}^2 + ${triangle.getSideCName()}^2`,
    keys: [...vertices, 'equal'],
    commands: triangle.generateCommands({}),
    coords: triangle.generateCoords(),
  };

  return question;
}
