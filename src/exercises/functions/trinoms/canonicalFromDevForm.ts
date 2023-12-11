import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  a: number;
};
type VEAProps = {};
const getCanonicalFromDevFormQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const answer = trinom.getCanonicalForm().toTex();
  const question: Question<QCMProps, VEAProps> = {
    answer,
    keys: ['x', 'equal', 'alpha', 'beta'],
    instruction: `Déterminer la forme canonique de la fonction $f$ définie par $f(x) = ${trinom.toTree().toTex()}$`,
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a: trinom.a },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      TrinomConstructor.randomCanonical(new DiscreteSet([new Integer(a), new Integer(-a)]))
        .getCanonicalForm()
        .toTex(),
    );
  }

  return shuffle(propositions);
};

export const canonicalFromDevForm: MathExercise<QCMProps, VEAProps> = {
  id: 'canonicalFromDevForm',
  connector: '\\iff',
  label: 'Déterminer la forme canonique à partir de la forme développée',
  levels: ['1reSpé'],
  isSingleStep: false,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getCanonicalFromDevFormQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
