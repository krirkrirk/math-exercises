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
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

type QCMProps = {
  answer: string;
  a: number;
  b: number;
};
type VEAProps = {};

const getLnDerivative: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const myfunction = new AddNode(
    new MultiplyNode(new NumberNode(a), new LogNode(new VariableNode('x'))),
    new NumberNode(b),
  );
  const derivative = simplifyNode(new FractionNode(new NumberNode(a), new VariableNode('x')));
  const answer = derivative.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()}$.`,
    startStatement: "f'(x)",
    answer,
    keys: ['x', 'ln', 'epower'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, a, b },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    new AddNode(new FractionNode(new NumberNode(a), new VariableNode('x')), new NumberNode(b)).toTex(),
  );
  tryToAddWrongProp(propositions, a + '');
  tryToAddWrongProp(propositions, new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x'))).toTex());

  while (propositions.length < n) {
    const randomA = randint(-9, 10, [0]);
    tryToAddWrongProp(
      propositions,
      simplifyNode(new FractionNode(new NumberNode(randomA), new VariableNode('x'))).toTex(),
    );
  }

  return shuffle(propositions);
};

export const lnDerivativeTwo: MathExercise<QCMProps, VEAProps> = {
  id: 'lnDerivativeTwo',
  connector: '=',
  label: 'Dérivée de $a \\times \\ln(x) + b$',
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', 'TermSpé'],
  sections: ['Dérivation', 'Logarithme népérien'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnDerivative, nb),
  getPropositions,

  qcmTimer: 60,
  freeTimer: 60,
};
