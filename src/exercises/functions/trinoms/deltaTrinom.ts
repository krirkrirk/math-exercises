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
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  a: number;
  b: number;

  c: number;
};
type VEAProps = {};

const getDeltaTrinomQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const trinom = TrinomConstructor.random();
  const answer = trinom.getDelta() + '';

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Soit $f(x) = ${trinom.toTree().toTex()}$. Calculer le discriminant $\\Delta$.`,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a: trinom.a, b: trinom.b, c: trinom.c },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const bMinus4ac = b - 4 * a * c;

  tryToAddWrongProp(propositions, bMinus4ac + '');

  const bSquarePlus4ac = b ** 2 + a * c;
  tryToAddWrongProp(propositions, bSquarePlus4ac + '');
  while (propositions.length < n) {
    const wrongAnswer = randint(-100, 100) + '';
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

export const deltaTrinom: MathExercise<QCMProps, VEAProps> = {
  id: 'deltaTrinom',
  connector: '=',
  getPropositions,

  label: "Calculer le discriminant d'un trinôme",
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getDeltaTrinomQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};
