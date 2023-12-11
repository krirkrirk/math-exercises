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
import { Complex, ComplexConstructor } from '#root/math/complex/complex';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  re: number;
  im: number;
};
type VEAProps = {};
const getConjugateComplexQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const complex = ComplexConstructor.random();
  const answer = complex.conjugate().toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Déterminer le conjugué de $z=${complex.toTree().toTex()}$.`,
    keys: ['i', 'overline'],
    answerFormat: 'tex',
    startStatement: '\\overline z',
    qcmGeneratorProps: { answer, re: complex.re, im: complex.im },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, re, im }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const complex = new Complex(re, im);
  const opposite = complex.opposite().toTree().toTex();
  tryToAddWrongProp(propositions, opposite);

  const conjOpposite = complex.conjugate().opposite().toTree().toTex();
  tryToAddWrongProp(propositions, conjOpposite);

  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

export const conjugateComplex: MathExercise<QCMProps, VEAProps> = {
  id: 'conjugateComplex',
  connector: '=',
  getPropositions,
  label: "Conjugué d'un nombre complexe",
  levels: ['MathExp'],
  isSingleStep: true,
  sections: ['Nombres complexes'],
  generator: (nb: number) => getDistinctQuestions(getConjugateComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};
