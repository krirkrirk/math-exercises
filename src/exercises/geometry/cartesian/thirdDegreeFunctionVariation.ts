import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const thirdDegreeFunctionVariation: Exercise = {
  id: 'thirdDegreeFunctionVariation',
  connector: '=',
  instruction: '',
  label: "Variations d'une fonction de degré 3",
  levels: ['4', '3', '2'],
  section: 'Géométrie cartésienne',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getThirdDegreeFunctionVariation, nb),
  keys: ['lbracket', 'rbracket', 'semicolon', 'infty'],
};

export function getThirdDegreeFunctionVariation(): Question {
  const a = randint(-3, 4, [0]);
  const c = randint(-2, 3);
  const racine1 = randint(-5, 4);
  const racine2 = randint(racine1 + 1, 6);

  const coefs: number[] = [c, a * racine1 * racine2, (-a * (racine1 + racine2)) / 2, a / 3];
  const polynome = new Polynomial(coefs);

  const coin = coinFlip() ? -1 : 1;

  const instruction =
    `Soit $f$ la fonction représentée ci-dessous. Sur quel intervalle la dérivée de $f$ est-elle ` +
    (coin < 0 ? 'négative ?' : 'positive ?');
  const answer =
    coin * a < 0
      ? `\\left[${racine1};${racine2}\\right]`
      : `\\left]-\\infty;${racine1}\\right] \\cup \\left[${racine2};+\\infty\\right[`;

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
    });

    res.push({
      id: v4() + '',
      statement: `\\left[${racine2};+\\infty\\right[`,
      isRightAnswer: false,
    });

    if (n > 2)
      res.push({
        id: v4() + '',
        statement: `\\left]-\\infty;${racine1}\\right]`,
        isRightAnswer: false,
      });

    if (n > 3)
      res.push({
        id: v4() + '',
        statement: `\\left]-\\infty;${racine1}\\right] \\cup \\left[${racine2};+\\infty\\right[`,
        isRightAnswer: false,
      });

    for (let i = 0; i < n - 4; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const racine1 = randint(-5, 4);
        const racine2 = randint(racine1 + 1, 6);
        const wrongAnswer = `\\left[${racine1};${racine2}\\right]`;
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

  const commands = [polynome.toString()];

  const ymax = Math.max(polynome.calculate(racine1), polynome.calculate(racine2));
  const ymin = Math.min(polynome.calculate(racine1), polynome.calculate(racine2));

  const question: Question = {
    instruction,
    startStatement: 'S',
    answer,
    keys: ['lbracket', 'rbracket', 'semicolon', 'infty'],
    getPropositions,
    coords: [
      racine1 - (randint(7, 20) / 10) * (racine2 - racine1),
      racine2 + (randint(7, 20) / 10) * (racine2 - racine1),
      ymin - ((ymax - ymin) * randint(7, 20)) / 10,
      ymax + ((ymax - ymin) * randint(7, 20)) / 10,
    ],
    commands,
  };
  return question;
}
