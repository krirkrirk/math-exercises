import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const trigonometryAngleCalcul: Exercise = {
  id: 'trigonometryAngleCalcul',
  connector: '=',
  instruction: '',
  label: 'Utiliser la trigonométrie pour calculer un angle',
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTrigonometryAngleCalcul, nb),
};

export function getTrigonometryAngleCalcul(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({ minRapport: 0.5, maxRapport: 1.5, names: vertices });

  const sides = [triangle.getSideCName(), triangle.getSideBName(), triangle.getSideAName()];

  const sideLengths = [triangle.getSideCnumber(), triangle.getSideBnumber(), triangle.getSideAnumber()].map((el) =>
    round(el / 2, 2),
  );

  const angle = [triangle.vertexB.name, triangle.vertexC.name];

  const randAngle = randint(0, 2);
  const randSides = shuffle([0, 1, 2]);

  const answer =
    randAngle === 0
      ? Math.round((Math.acos(sideLengths[0] / sideLengths[2]) * 180) / Math.PI)
      : Math.round((Math.acos(sideLengths[1] / sideLengths[2]) * 180) / Math.PI);

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer + '°',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: randint(20, 80) + '°',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Le triangle ${triangle.getTriangleName()} rectangle en ${triangle.getRightAngle()} est tel que ${
      sides[randSides[0]]
    } = $${sideLengths[randSides[0]]}$ cm et ${sides[randSides[1]]} = $${
      sideLengths[randSides[1]]
    }$ cm.$\\\\$ Calculer $\\widehat{${angle[randAngle]}}$ à 1° près.`,
    answer: answer + '°',
    keys: [...vertices, 'equal', '°', 'cos', 'sin', 'tan', 'arccos', 'arcsin', 'arctan'],
    commands: [...triangle.generateCommands({ highlightedAngle: angle[randAngle] })],
    coords: triangle.generateCoords(),
    getPropositions,
  };

  return question;
}
