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
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getAlphaBetaFromDevFormQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const param = coinFlip() ? '\\alpha' : '\\beta';
  const alphaTex = trinom.getAlphaNode().toTex();
  const betaTex = trinom.getBetaNode().toTex();
  const answer = param === '\\alpha' ? alphaTex : betaTex;

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    keys: ['x', 'alpha', 'beta'],
    instruction: `Soit $f$ la fonction définie par $f(x) = ${trinom.toTree().toTex()}$. Que vaut $${param}$ ?`,
    answerFormat: 'tex',
    startStatement: param,
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 11).toString());
  }

  return shuffle(propositions);
};

export const alphaBetaFromDevForm: MathExercise<QCMProps, VEAProps> = {
  id: 'alphaBetaFromDevForm',
  connector: '=',
  label: 'Déterminer $\\alpha$ ou $\\beta$ à partir de la forme développée',
  levels: ['1reSpé'],
  isSingleStep: false,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getAlphaBetaFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
