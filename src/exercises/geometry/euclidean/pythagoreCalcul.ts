import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { SquareRoot, SquareRootConstructor } from '#root/math/numbers/reals/squareRoot';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const pythagoreCalcul: Exercise = {
  id: 'pythagoreCalcul',
  connector: '=',
  instruction: '',
  label: 'Utiliser le théoreme de Pythagore pour faire des calculs',
  levels: ['3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getPythagoreCalcul, nb),
};

export function getPythagoreCalcul(): Question {
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

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer + '',
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const temp = randint(2, 300);
        const squareRoot = new SquareRoot(temp);
        const wrongAnswer =
          Math.sqrt(temp) === Math.floor(Math.sqrt(temp)) ? Math.sqrt(temp).toString() : squareRoot.toTree().toTex();

        proposition = {
          id: v4() + '',
          statement: wrongAnswer,
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction: `Dans le triangle ${triangle.getTriangleName()} ci-dessous rectangle en ${triangle.getRightAngle()}, on sait que ${
      sides[randoms[0]]
    } = $${sideLengths[randoms[0]]}$ et que ${sides[randoms[1]]} = $${
      sideLengths[randoms[1]]
    }$.$\\\\$Calculer la longueur exacte ${sides[randoms[2]]}`,
    answer: answer + '',
    keys: [...vertices, 'equal'],
    commands,
    coords: triangle.generateCoords(),
    getPropositions,
  };

  return question;
}
