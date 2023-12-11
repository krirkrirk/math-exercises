import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { KeyId } from '#root/types/keyIds';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  sideA: string;
  sideB: string;
  sideC: string;
};
type VEAProps = {};
const getTrigonometry: QuestionGenerator<QCMProps, VEAProps> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({ minRapport: 0.7, maxRapport: 1.3, names: vertices });

  const sideA = triangle.getSideAName();
  const sideB = triangle.getSideBName();
  const sideC = triangle.getSideCName();
  const trigo = ['le cosinus', 'le sinus', 'la tangente'];
  const randTrigo = randint(0, 3);

  const angle = [triangle.vertexB.name, triangle.vertexC.name];
  const randAngle = randint(0, 2);

  let quotient: string[];

  switch (randAngle) {
    case 0:
      quotient = [`\\frac{${sideC}}{${sideA}}`, `\\frac{${sideB}}{${sideA}}`, `\\frac{${sideB}}{${sideC}}`];
      break;
    case 1:
      quotient = [`\\frac{${sideB}}{${sideA}}`, `\\frac{${sideC}}{${sideA}}`, `\\frac{${sideC}}{${sideB}}`];
      break;
    default:
      quotient = [''];
  }

  const answer = quotient[randTrigo];
  const question: Question<QCMProps, VEAProps> = {
    instruction: `À quel quotient est égal ${trigo[randTrigo]} de l'angle $\\widehat{${angle[randAngle]}}$?`,
    answer,
    keys: [...(vertices as KeyId[]), 'equal'],
    commands: [...triangle.generateCommands({ highlightedAngle: angle[randAngle] })],
    coords: triangle.generateCoords(),
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, sideA, sideB, sideC },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, sideA, sideB, sideC }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const wrongQuotients = [
    `\\frac{${sideC}}{${sideA}}`,
    `\\frac{${sideB}}{${sideA}}`,
    `\\frac{${sideB}}{${sideC}}`,
    `\\frac{${sideB}}{${sideA}}`,
    `\\frac{${sideC}}{${sideA}}`,
    `\\frac{${sideC}}{${sideB}}`,
    `\\frac{${sideA}}{${sideC}}`,
    `\\frac{${sideA}}{${sideB}}`,
    `\\frac{${sideC}}{${sideB}}`,
    `\\frac{${sideA}}{${sideB}}`,
    `\\frac{${sideA}}{${sideC}}`,
    `\\frac{${sideB}}{${sideC}}`,
  ];
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, wrongQuotients[randint(0, 12)]);
  }

  return shuffle(propositions);
};

export const trigonometry: MathExercise<QCMProps, VEAProps> = {
  id: 'trigonometry',
  connector: '=',
  label: "Écrire le quotient égal au cosinus, au sinus ou à la tangente d'un angle dans un triangle rectangle",
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getTrigonometry, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
