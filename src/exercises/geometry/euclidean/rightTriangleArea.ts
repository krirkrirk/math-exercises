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

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getRightTriangleArea: QuestionGenerator<QCMProps, VEAProps> = () => {
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

  const answer = ((sidesLength[0] * sidesLength[1]) / 2 + '').replace('.', ',');
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire du triangle ${triangle.getTriangleName()} rectangle en ${triangle.getRightAngle()} sachant que ${triangle.getSideBName()} = $${
      sidesLength[0]
    }$ cm et ${triangle.getSideCName()} = $${sidesLength[1]}$ cm.`,
    answer,
    keys: [...(vertices as KeyId[]), 'equal', 'cm2'],
    commands,
    coords: triangle.generateCoords(),
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, (randint(2, 12) * randint(2, 12)) / 2 + '');
  }

  return shuffle(propositions);
};

export const rightTriangleArea: MathExercise<QCMProps, VEAProps> = {
  id: 'rightTriangleArea',
  connector: '=',
  label: "Calculer l'aire d'un triangle rectangle",
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getRightTriangleArea, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
