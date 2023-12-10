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
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  int: number;
  power: number;
};
type VEAProps = {};
const getCalculatePowerQuestion: QuestionGenerator<QCMProps, VEAProps> = () => {
  const int = randint(0, 11);
  const power = randint(-5, 0);
  const statement = new PowerNode(new NumberNode(int), new NumberNode(power)).toTex();
  const answer = int === 0 ? '0' : new Rational(1, int ** Math.abs(power)).simplify().toTree().toTex();

  const question: Question<QCMProps, VEAProps> = {
    answer,
    instruction: `Calculer : $${statement}$`,
    keys: [],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, int, power },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, int, power }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, int * power + '');
  tryToAddWrongProp(propositions, -(int ** Math.abs(power)) + '');
  tryToAddWrongProp(propositions, int * power + '');
  if (int < 0) tryToAddWrongProp(propositions, -(int ** power) + '');
  if (int === 0 || int === 1) {
    tryToAddWrongProp(propositions, power + '');
    tryToAddWrongProp(propositions, '0');
    tryToAddWrongProp(propositions, '1');
    tryToAddWrongProp(propositions, '-1');
    tryToAddWrongProp(propositions, '2');
    tryToAddWrongProp(propositions, -power + '');
  }
  while (propositions.length < n) {
    const wrongAnswer = new Rational(1, int ** randint(0, 6, [power])).simplify().toTree().toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const calculateNegativePower: MathExercise<QCMProps, VEAProps> = {
  id: 'calculateNegativePower',
  connector: '=',
  label: 'Calculer une puissance négative',
  levels: ['4ème', '3ème', '2ndPro', '2nde', 'CAP'],
  isSingleStep: true,
  sections: ['Puissances'],
  generator: (nb: number) => getDistinctQuestions(getCalculatePowerQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
