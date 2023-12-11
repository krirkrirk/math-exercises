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
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  a: number;
};
type VEAProps = {};

const getRootFunctionDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-19, 20, [0]);

  let instruction = `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =$ `;
  let answer = '';

  if (a === 1) instruction += `$\\sqrt{x}$.`;
  else if (a === -1) instruction += `$-\\sqrt{x}$.`;
  else instruction += `$${a}\\sqrt{x}$.`;

  if (a % 2 === 0) answer = `${a < 0 ? '-' : ''}\\frac{${Math.abs(a / 2)}}{\\sqrt{x}}`;
  else answer = `${a < 0 ? '-' : ''}\\frac{${Math.abs(a)}}{2\\sqrt{x}}`;

  const question: Question<QCMProps, VEAProps> = {
    instruction,
    startStatement: `f'(x)`,
    answer,
    keys: ['x'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, `\\frac{${a}}{\\sqrt(x)}`);
  tryToAddWrongProp(propositions, `${a}`);
  tryToAddWrongProp(propositions, `\\frac{${a}}{x}`);

  while (propositions.length < n) {
    const randomA = randint(-9, 10, [0]);
    const isEvenA = randomA / 2 === round(randomA / 2, 0);
    if (isEvenA) {
      tryToAddWrongProp(propositions, `\\frac{${randomA / 2}}{\\sqrt{x}}`);
    } else {
      tryToAddWrongProp(propositions, `\\frac{${randomA}}{2\\sqrt{x}}`);
    }
  }

  return shuffle(propositions);
};

export const rootFunctionDerivative: MathExercise<QCMProps, VEAProps> = {
  id: 'rootFunctionDerivative',
  connector: '=',
  label: "Dérivée d'une fonction racine",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp'],
  sections: ['Dérivation', 'Racines carrées'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getRootFunctionDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
