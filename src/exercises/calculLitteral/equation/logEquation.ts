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
import { Rational } from '#root/math/numbers/rationals/rational';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { LogNode } from '#root/tree/nodes/functions/logNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getLnEquation: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 20, [0]);
  const k = randint(-9, 20, [0]);

  const equation = new EqualNode(
    simplifyNode(new MultiplyNode(new NumberNode(a), new LogNode(new VariableNode('x')))),
    new NumberNode(k),
  );
  const answer = new ExpNode(new Rational(k, a).simplify().toTree()).toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre l'équation $${equation.toTex()}$.`,
    answer,
    keys: ['x', 'equal', 'ln', 'epower', 'exp'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const randomA = randint(1, 10);
    const randomK = randint(1, 20);
    tryToAddWrongProp(
      propositions,
      new ExpNode(simplifyNode(new FractionNode(new NumberNode(randomK), new NumberNode(randomA)))).toTex(),
    );
  }

  return shuffle(propositions);
};

export const logEquation: MathExercise<QCMProps, VEAProps> = {
  id: 'logEquation',
  connector: '=',
  label: 'Résoudre des équations de type $a \\times \\ln(x) = k$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  sections: ['Logarithme népérien'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnEquation, nb),
  getPropositions,
  qcmTimer: 60,
  freeTimer: 60,
};
