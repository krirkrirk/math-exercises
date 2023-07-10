import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const trigonometry: Exercise = {
  id: 'trigonometry',
  connector: '=',
  instruction: '',
  label: "Écrire le quotient égal au cosinus, au sinus ou à la tangente d'un angle dans un triangle rectangle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTrigonometry, nb),
};

export function getTrigonometry(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({ minRapport: 0.7, maxRapport: 1.3, names: vertices });

  const trigo = ['le cosinus', 'le sinus', 'la tangente'];
  const randTrigo = randint(0, 3);

  const angle = [triangle.vertexB.name, triangle.vertexC.name];
  const randAngle = randint(0, 2);

  let quotient: string[];

  switch (randAngle) {
    case 0:
      quotient = [
        `\\frac{${triangle.getSideCName()}}{${triangle.getSideAName()}}`,
        `\\frac{${triangle.getSideBName()}}{${triangle.getSideAName()}}`,
        `\\frac{${triangle.getSideBName()}}{${triangle.getSideCName()}}`,
      ];
      break;
    case 1:
      quotient = [
        `\\frac{${triangle.getSideBName()}}{${triangle.getSideAName()}}`,
        `\\frac{${triangle.getSideCName()}}{${triangle.getSideAName()}}`,
        `\\frac{${triangle.getSideCName()}}{${triangle.getSideBName()}}`,
      ];
      break;
    default:
      quotient = [''];
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    const wrongQuotients = [
      `\\frac{${triangle.getSideCName()}}{${triangle.getSideAName()}}`,
      `\\frac{${triangle.getSideBName()}}{${triangle.getSideAName()}}`,
      `\\frac{${triangle.getSideBName()}}{${triangle.getSideCName()}}`,
      `\\frac{${triangle.getSideBName()}}{${triangle.getSideAName()}}`,
      `\\frac{${triangle.getSideCName()}}{${triangle.getSideAName()}}`,
      `\\frac{${triangle.getSideCName()}}{${triangle.getSideBName()}}`,
      `\\frac{${triangle.getSideAName()}}{${triangle.getSideCName()}}`,
      `\\frac{${triangle.getSideAName()}}{${triangle.getSideBName()}}`,
      `\\frac{${triangle.getSideCName()}}{${triangle.getSideBName()}}`,
      `\\frac{${triangle.getSideAName()}}{${triangle.getSideBName()}}`,
      `\\frac{${triangle.getSideAName()}}{${triangle.getSideCName()}}`,
      `\\frac{${triangle.getSideBName()}}{${triangle.getSideCName()}}`,
    ];

    res.push({
      id: v4() + '',
      statement: quotient[randTrigo],
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: wrongQuotients[randint(0, 12)],
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `À quel quotient est égal ${trigo[randTrigo]} de l'angle $\\widehat{${angle[randAngle]}}$?`,
    answer: quotient[randTrigo],
    keys: [...vertices, 'equal'],
    commands: [...triangle.generateCommands({ highlightedAngle: angle[randAngle] })],
    coords: triangle.generateCoords(),
    getPropositions,
  };

  return question;
}
