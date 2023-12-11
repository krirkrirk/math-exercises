import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  QCMGenerator,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getDerivativeNumberCalculQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const x = randint(-9, 10);
  const trinom = PolynomialConstructor.randomWithOrder(2);

  const instruction = `Soit $f(x) = ${trinom.toTree().toTex()}$. Calculer $f'(${x})$.`;
  const answer = trinom.derivate().calculate(x) + '';

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction,
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
    const wrongAnswer = randint(-20, 20) + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const derivativeNumberCalcul: MathExercise<QCMProps, VEAProps> = {
  id: 'derivativeNumberCalcul',
  connector: '=',
  label: 'Calculer un nombre dérivé via la définition',
  levels: ['1reSpé'],
  isSingleStep: true,
  sections: ['Dérivation', 'Limites'],
  generator: (nb: number) => getDistinctQuestions(getDerivativeNumberCalculQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
