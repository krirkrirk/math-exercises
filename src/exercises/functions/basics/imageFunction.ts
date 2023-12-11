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
};
type VEAProps = {};

const getImageFunction: QuestionGenerator<QCMProps, VEAProps> = () => {
  const rand = coinFlip();
  const polynome1 = new Polynomial([randint(-9, 10), randint(-5, 6, [0])]);
  const polynome2 = new Polynomial([randint(-9, 10), randint(-9, 10), randint(-4, 5, [0])]);
  const xValue = randint(-9, 10);

  const statement = rand
    ? `Soit $f(x) = ${polynome1.toTree().toTex()}$. Calculer $f(${xValue})$.`
    : `Soit $f(x) = ${polynome2.toTree().toTex()}$. Calculer $f(${xValue})$.`;

  const answer = rand ? polynome1.calculate(xValue) + '' : polynome2.calculate(xValue) + '';

  const question: Question<QCMProps, VEAProps> = {
    instruction: statement,
    startStatement: `f(${xValue})`,
    answer: answer,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };
  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const wrongAnswer = Number(answer) + randint(-10, 11, [0]);

    tryToAddWrongProp(propositions, wrongAnswer + '');
  }

  return shuffle(propositions);
};

export const imageFunction: MathExercise<QCMProps, VEAProps> = {
  id: 'imageFunction',
  connector: '=',
  label: "Image d'une fonction",
  levels: ['3ème', '2nde', 'CAP', '2ndPro', '1rePro', '1reTech'],
  sections: ['Fonctions'],
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getImageFunction, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
