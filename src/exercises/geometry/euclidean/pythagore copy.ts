import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';

export const pythagoreC: Exercise = {
  id: 'pythagoreC',
  connector: '=',
  instruction: "Écrire l'égalité de Pythagore pour la figure suivante : ",
  label: 'Utiliser le théoreme de PythagoreC',
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getPythagoreC, nb),
};

export function getPythagoreC(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle(0.7, 1.3, ...vertices);

  const commands = [...triangle.generateCommands({}), `ShowAxes(false)`, `ShowGrid(true)`, `ShowLabel(be, true)`];

  const question: Question = {
    answer: `${triangle.getSideAName()}^2 = ${triangle.getSideBName()}^2 + ${triangle.getSideCName()}^2`,
    keys: [...vertices, 'equal'],
    commands,
    coords: triangle.generateCoords(),
  };

  return question;
}