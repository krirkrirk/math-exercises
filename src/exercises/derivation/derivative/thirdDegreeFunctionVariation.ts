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
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  racine1: number;
  racine2: number;
};
type VEAProps = {};

const getThirdDegreeFunctionVariation: QuestionGenerator<QCMProps, VEAProps> = () => {
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
  const answer = coin * a < 0 ? `[${racine1};${racine2}]` : `]-\\infty;${racine1}]\\cup[${racine2};+\\infty[`;

  const commands = [polynome.toString()];

  const ymax = Math.max(polynome.calculate(racine1), polynome.calculate(racine2));
  const ymin = Math.min(polynome.calculate(racine1), polynome.calculate(racine2));

  const question: Question<QCMProps, VEAProps> = {
    instruction,
    startStatement: 'S',
    answer,
    keys: ['lbracket', 'rbracket', 'semicolon', 'infty'],
    answerFormat: 'tex',

    coords: [
      racine1 - (randint(7, 20) / 10) * (racine2 - racine1),
      racine2 + (randint(7, 20) / 10) * (racine2 - racine1),
      ymin - ((ymax - ymin) * randint(7, 20)) / 10,
      ymax + ((ymax - ymin) * randint(7, 20)) / 10,
    ],
    commands,
    qcmGeneratorProps: { answer, racine1, racine2 },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, racine1, racine2 }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `[${racine2};+\\infty[`);
  tryToAddWrongProp(propositions, `]-\\infty;${racine1}]`);
  tryToAddWrongProp(propositions, `]-\\infty;${racine1}] \\cup [${racine2};+\\infty[`);

  while (propositions.length < n) {
    const racine1 = randint(-5, 4);
    const racine2 = randint(racine1 + 1, 6);
    const wrongAnswer = `[${racine1};${racine2}]`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const thirdDegreeFunctionVariation: MathExercise<QCMProps, VEAProps> = {
  id: 'thirdDegreeFunctionVariation',
  connector: '=',
  label: "Lecture du signe de la dérivée via les variations d'une fonction",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', '1rePro', 'TermPro', 'TermTech'],
  sections: ['Dérivation'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getThirdDegreeFunctionVariation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
