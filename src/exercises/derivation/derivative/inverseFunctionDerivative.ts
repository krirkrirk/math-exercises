import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  a: number;
};
type VEAProps = {};

const getInverseFunctionDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-19, 20, [0]);
  const answer = `${a > 0 ? '-' : ''}\\frac{${Math.abs(a)}}{x^2}`;
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =\\frac{${a}}{x}$.`,
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

  tryToAddWrongProp(propositions, `\\frac{${a}}{x^2}`);
  tryToAddWrongProp(propositions, `\\frac{${a}}{x}`);
  tryToAddWrongProp(propositions, `${a}`);
  tryToAddWrongProp(propositions, `\\frac{${2 * a}}{x}`);

  while (propositions.length < n) {
    const wrongAnswer = `\\frac{${randint(-9, 10, [0, -a])}}{x^2}`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const inverseFunctionDerivative: MathExercise<QCMProps, VEAProps> = {
  id: 'inverseFunctionDerivative',
  connector: '=',
  label: "Dérivée d'une fonction inverse",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', 'TermTech'],
  sections: ['Dérivation', 'Fonction inverse'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getInverseFunctionDerivative, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
