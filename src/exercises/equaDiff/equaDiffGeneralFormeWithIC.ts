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
import { OppositeNode } from '#root/tree/nodes/functions/oppositeNode';
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

const solveExponentialEquationWithIC: QuestionGenerator<QCMProps, VEAProps> = () => {
  const a = randint(-9, 10, [0]);
  const initialY = randint(-9, 10);

  const myEquation = simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('y')));
  const myAnswer =
    initialY === 0
      ? new NumberNode(0) // y(0) = 0 ==> y(x) = 0
      : new EqualNode(
          new VariableNode('y'),
          initialY === 1
            ? new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))) // éviter les 1e^(x)
            : initialY === -1
            ? new OppositeNode(new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x'))))) // éviter les -1e^(x)
            : new MultiplyNode(
                new NumberNode(initialY),
                new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))),
              ),
        ); // y = y(0)e^(ax);

  const question: Question<QCMProps, VEAProps> = {
    instruction: `Résoudre l'équation différentielle suivante avec la condition initiale $y(0) = ${initialY}$ : $y' = ${myEquation.toTex()}$.`,
    startStatement: `y(x)`,
    answer: myAnswer.toTex(),
    keys: ['x', 'y', 'epower', 'exp', 'equal'],
    answerFormat: 'tex',
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const a = randint(-9, 10, [0]);
    const initialY = randint(-9, 10);
    const myWrongAnswer =
      initialY === 0
        ? new NumberNode(0)
        : new EqualNode(
            new VariableNode('y'),
            initialY === 1
              ? new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x'))))
              : initialY === -1
              ? new OppositeNode(new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))))
              : new MultiplyNode(
                  new NumberNode(initialY),
                  new ExpNode(simplifyNode(new MultiplyNode(new NumberNode(a), new VariableNode('x')))),
                ),
          );
    tryToAddWrongProp(propositions, myWrongAnswer.toTex());
  }

  return shuffle(propositions);
};

export const exponentialDifferentialEquationWithIC: MathExercise<QCMProps, VEAProps> = {
  id: 'exponentialDifferentialEquationWithIC',
  connector: '=',
  label: "Équation Différentielle : $y' = ay$ avec conditions initiales",
  levels: ['1reSpé', 'MathComp', 'TermSpé'],
  sections: ['Équations différentielles'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(solveExponentialEquationWithIC, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
