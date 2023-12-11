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
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getInverseImageFunction: QuestionGenerator<QCMProps, VEAProps> = () => {
  const polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const xValue = randint(-9, 10);

  let answer = polynome1.calculate(xValue) + '';
  const statement = `Soit $f(x) = ${polynome1
    .toTree()
    .toTex()}$. Déterminer le ou les antécédents de $${answer}$ par $f$.`;
  answer = 'x=' + xValue;
  const question: Question<QCMProps, VEAProps> = {
    instruction: statement,
    startStatement: `f(x) = ${answer}`,
    answer,
    keys: ['x', 'equal'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const xValue = Number(answer.split('=')[1]);
  while (propositions.length < n) {
    const wrongAnswer = xValue + randint(-10, 11, [0]);
    tryToAddWrongProp(propositions, wrongAnswer + '');
  }

  return shuffle(propositions);
};

export const inverseImageFunction: MathExercise<QCMProps, VEAProps> = {
  id: 'inverseImageFunction',
  connector: '\\iff',
  getPropositions,
  label: 'Calculer des antécédents',
  levels: ['3ème', '2nde', 'CAP', '2ndPro', '1rePro', '1reTech'],
  sections: ['Fonctions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getInverseImageFunction, nb),
  qcmTimer: 60,
  freeTimer: 60,
};
