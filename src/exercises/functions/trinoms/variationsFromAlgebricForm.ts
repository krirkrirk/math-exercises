import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  addWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
  a: number;
};
type VEAProps = {};
const getVariationsFromAlgebricFormQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const isDevForm = coinFlip();
  const trinom = isDevForm ? TrinomConstructor.random() : TrinomConstructor.randomCanonical();
  const answer = trinom.a > 0 ? 'Décroissante puis croissante' : 'Croissante puis décroissante';

  const question: Question<QCMProps, VEAProps> = {
    answer: answer,
    instruction: `Quelles sont les variations de la fonction $f$ définie par $f(x) = ${
      isDevForm ? trinom.toTree().toTex() : trinom.getCanonicalForm().toTex()
    }$ ?`,
    answerFormat: 'raw',
    qcmGeneratorProps: { answer, a: trinom.a },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  addWrongProp(propositions, a < 0 ? 'Décroissante puis croissante' : 'Croissante puis décroissante', 'raw');

  addWrongProp(propositions, 'Constante', 'raw');
  addWrongProp(propositions, 'On ne peut pas savoir', 'raw');

  return shuffle(propositions);
};

export const variationsFromAlgebricForm: MathExercise<QCMProps, VEAProps> = {
  id: 'variationsFromAlgebricForm',
  label: "Déterminer les variations d'une fonction du second degré via sa forme algébrique",
  levels: ['1reSpé'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getVariationsFromAlgebricFormQuestion, nb),
  answerType: 'QCM',
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
