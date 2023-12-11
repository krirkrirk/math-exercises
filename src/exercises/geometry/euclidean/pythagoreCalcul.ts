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
import { SquareRoot } from '#root/math/numbers/reals/real';
import { randint } from '#root/math/utils/random/randint';
import { KeyId } from '#root/types/keyIds';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getPythagoreCalcul: QuestionGenerator<QCMProps, VEAProps> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({ minRapport: 0.7, maxRapport: 1.3, names: vertices });

  const sides = [triangle.getSideCName(), triangle.getSideBName(), triangle.getSideAName()];

  const sideLengths = [triangle.getSideCnumber(), triangle.getSideBnumber(), triangle.getSideAnumber()].map((el) =>
    Math.round(el / 2),
  );

  const zeroOrOne = shuffle([0, 1]);
  const randoms = coinFlip() ? [...zeroOrOne, 2] : [2, ...zeroOrOne];
  // le but est d'avoir une chance sur 2 d'avoir un hépoténus et une 1 chance sur 2 d'avoir un a des 2 autres cote
  let answer: string | number;

  if (randoms[2] === 2) {
    // cas de l'hypoténus
    answer = Math.hypot(sideLengths[0], sideLengths[1]);
    answer = Math.round(answer) === answer ? answer : `\\sqrt{${sideLengths[0] ** 2 + sideLengths[1] ** 2}}`;
  } else {
    // les deux autres cotés
    answer = Math.sqrt(Math.abs(sideLengths[randoms[0]] ** 2 - sideLengths[randoms[1]] ** 2));
    answer =
      Math.round(answer) === answer
        ? answer
        : `\\sqrt{${Math.abs(sideLengths[randoms[0]] ** 2 - sideLengths[randoms[1]] ** 2)}}`;
  }

  const commands = [
    ...triangle.generateCommands({
      showLabels: [...sides, sides[randoms[2]]],
      setCaptions: [...sideLengths.map((el) => el + ''), '?'],
      highlightedSide: sides[randoms[2]],
    }),
  ];
  answer = answer + '';
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Dans le triangle ${triangle.getTriangleName()} ci-dessous rectangle en ${triangle.getRightAngle()}, on sait que ${
      sides[randoms[0]]
    } = $${sideLengths[randoms[0]]}$ et que ${sides[randoms[1]]} = $${
      sideLengths[randoms[1]]
    }$.$\\\\$Calculer la longueur exacte ${sides[randoms[2]]}`,
    answer,
    keys: [...(vertices as KeyId[]), 'equal'],
    commands,
    coords: triangle.generateCoords(),
    answerFormat: 'tex',
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const temp = randint(2, 300);
    const squareRoot = new SquareRoot(temp);
    const wrongAnswer =
      Math.sqrt(temp) === Math.floor(Math.sqrt(temp)) ? Math.sqrt(temp).toString() : squareRoot.toTree().toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const pythagoreCalcul: MathExercise<QCMProps, VEAProps> = {
  id: 'pythagoreCalcul',
  connector: '=',
  label: 'Utiliser le théoreme de Pythagore pour faire des calculs',
  levels: ['4ème', '3ème', '2nde'],
  isSingleStep: false,
  sections: ['Géométrie euclidienne'],
  generator: (nb: number) => getDistinctQuestions(getPythagoreCalcul, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
