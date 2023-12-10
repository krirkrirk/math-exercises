import {
  shuffleProps,
  MathExercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { coinFlip } from '#root/utils/coinFlip';
import { probaFlip } from '#root/utils/probaFlip';
type QCMProps = {
  answer: string;
  isParityQuestion: boolean;
  isEvenQuestion: boolean;
  nbFaces: number;
};
type VEAProps = {};

const getDiceBasicProbasQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const nbFaces = randint(4, 10);
  const isParityQuestion = probaFlip(0.3);
  const isEvenQuestion = coinFlip();
  const faceAsked = randint(1, nbFaces + 1);
  const target = isParityQuestion ? `un nombre ${isEvenQuestion ? 'pair' : 'impair'}` : `la face ${faceAsked}`;
  const answer = isParityQuestion
    ? isEvenQuestion
      ? new Rational(Math.floor(nbFaces / 2), nbFaces).simplify().tex
      : new Rational(Math.ceil(nbFaces / 2), nbFaces).simplify().tex
    : `\\frac{1}{${nbFaces}}`;

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `On lance un dé à ${nbFaces} faces. Quelle est la probabilité d'obtenir ${target} ?`,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, isParityQuestion, isEvenQuestion, nbFaces },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, isParityQuestion, isEvenQuestion, nbFaces }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (isParityQuestion) {
    tryToAddWrongProp(propositions, '\\frac{1}{2}');
    if (isEvenQuestion) tryToAddWrongProp(propositions, new Rational(Math.ceil(nbFaces / 2), nbFaces).simplify().tex);
    else tryToAddWrongProp(propositions, new Rational(Math.floor(nbFaces / 2), nbFaces).simplify().tex);
  } else {
    tryToAddWrongProp(propositions, '1');
    tryToAddWrongProp(propositions, '\\frac{1}{6}');
  }

  while (propositions.length < n) {
    const wrongAnswer = new Rational(randint(1, nbFaces + 1), nbFaces).simplify().tex;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const diceBasicProbas: MathExercise<QCMProps, VEAProps> = {
  id: 'diceBasicProbas',
  connector: '=',
  label: 'Calcul de probabilité simple avec un dé',
  levels: ['5ème', '4ème', '3ème', '2ndPro', '2nde', 'CAP'],
  isSingleStep: true,
  sections: ['Probabilités'],
  generator: (nb: number) => getDistinctQuestions(getDiceBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
