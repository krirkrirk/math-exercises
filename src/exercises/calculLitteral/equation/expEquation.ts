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

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getExpEquation: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 20, [0]);
  const k = a > 0 ? randint(1, 20) : randint(-20, 0);

  const equation = new EqualNode(
    simplifyNode(new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x')))),
    new NumberNode(k),
  );
  const answer = new LogNode(simplifyNode(new FractionNode(new NumberNode(k), new NumberNode(a)))).toTex();

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre l'équation $${equation.toTex()}$.`,
    answer: answer,
    keys: ['x', 'equal', 'epower', 'exp', 'ln'],
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
      new LogNode(simplifyNode(new FractionNode(new NumberNode(randomK), new NumberNode(randomA)))).toTex(),
    );
  }

  return shuffle(propositions);
};

export const expEquation: MathExercise<QCMProps, VEAProps> = {
  id: 'expEquation',
  connector: '=',
  label: 'Résoudre des équations de type $a \\times \\exp(x) = k$',
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  sections: ['Exponentielle'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
