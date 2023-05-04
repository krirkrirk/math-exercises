import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';

export const trigonometryAngleCalcul: Exercise = {
  id: 'trigonometryAngleCalcul',
  connector: '=',
  instruction: '',
  label: 'Calculer un angle dans un triangle rectangle',
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTrigonometryAngleCalcul, nb),
};

export function getTrigonometryAngleCalcul(): Question {
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
  const randside2 = randint(0, 3, [randside]); // si rand = 0, valeurs possible 1 2

  const answer =
    randAngle === 0
      ? Math.round((Math.acos(sideLengths[0] / sideLengths[2]) * 180) / Math.PI)
      : Math.round((Math.acos(sideLengths[1] / sideLengths[2]) * 180) / Math.PI);

  const question: Question = {
    instruction: `Le triangle ${triangle.getTriangleName()} rectangle en ${triangle.getRightAngle()} est tel que ${
      sides[randside]
    } = $${sideLengths[randside]}$ cm et ${sides[randside2]} = $${
      sideLengths[randside2]
    }$ cm.$\\\\$ Calculer $\\widehat{${angle[randAngle]}}$ à 1° près.`,
    answer: answer + '°',
    keys: [...vertices, 'equal'],
    commands: [...triangle.generateCommands({ angle: angle[randAngle], colorAngle: 'Red' })],
    coords: triangle.generateCoords(),
  };

  return question;
}
