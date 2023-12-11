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
import { round } from '#root/math/utils/round';
import { KeyId } from '#root/types/keyIds';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getTrigonometryAngleCalcul: QuestionGenerator<QCMProps, VEAProps> = () => {
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
  const answerTex = answer + '°';

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Le triangle ${triangle.getTriangleName()} rectangle en ${triangle.getRightAngle()} est tel que ${
      sides[randSides[0]]
    } = $${sideLengths[randSides[0]]}$ cm et ${sides[randSides[1]]} = $${
      sideLengths[randSides[1]]
    }$ cm.$\\\\$ Calculer $\\widehat{${angle[randAngle]}}$ à 1° près.`,
    answer: answerTex,
    keys: [...(vertices as KeyId[]), 'equal', 'degree', 'cos', 'sin', 'tan', 'arccos', 'arcsin', 'arctan'],
    commands: [...triangle.generateCommands({ highlightedAngle: angle[randAngle] })],
    coords: triangle.generateCoords(),
    answerFormat: 'tex',
    qcmGeneratorProps: { answer: answerTex },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(20, 80) + '°');
  }

  return shuffle(propositions);
};

export const trigonometryAngleCalcul: MathExercise<QCMProps, VEAProps> = {
  id: 'trigonometryAngleCalcul',
  connector: '=',
  label: 'Utiliser la trigonométrie pour calculer un angle',
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getTrigonometryAngleCalcul, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
