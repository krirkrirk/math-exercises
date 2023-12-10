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
import { ConstantNode } from '#root/tree/nodes/numbers/constantNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { EqualNode } from '#root/tree/nodes/operators/equalNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';

type QCMProps = {
  answer: string;
};
type VEAProps = {};

const getExponentialEquation: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-19, 20, [0]);

  const myEquation = simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('y')));

  const myAnswer = new EqualNode(
    new VariableNode('y'),
    new MultiplyNode(
      new ConstantNode('C', 'C'),
      new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))),
    ),
  ); // y = Ce^(ax);

  const answer = myAnswer.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre l'équation différentielle suivante : $y' = ${myEquation.toTex()}$.`,
    startStatement: `y(x)`,
    answer,
    keys: ['x', 'y', 'epower', 'exp', 'C', 'equal'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const a = randint(1, 10);
    const myWrongAnswer = new EqualNode(
      new VariableNode('y'),
      new MultiplyNode(
        new ConstantNode('C', 'C'),
        new ExpNode(new MultiplyNode(new NumberNode(a), new VariableNode('x'))),
      ),
    );
    tryToAddWrongProp(propositions, myWrongAnswer.toTex());
  }

  return shuffle(propositions);
};

export const exponentialDifferentialEquation: MathExercise<QCMProps, VEAProps> = {
  id: 'exponentialDifferentialEquation',
  connector: '=',
  label: "Équation Différentielle : $y' = ay$",
  levels: ['1reSpé', 'MathComp', 'TermSpé'],
  sections: ['Équations différentielles'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExponentialEquation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
