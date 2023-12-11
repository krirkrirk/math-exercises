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
import { AffineConstructor } from '#root/math/polynomials/affine';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';
type QCMProps = {
  answer: string;
  random: number;
};
type VEAProps = {};

const getExpSimplifiying: QuestionGenerator<QCMProps, VEAProps> = () => {
  const random = randint(1, 4);

  let expression;

  switch (random) {
    case 1:
      expression = new FractionNode(
        new MultiplyNode(
          new ExpNode(new Polynomial([0, randint(-9, 10, [0])]).toTree()),
          new ExpNode(new NumberNode(randint(-9, 10, [0]))),
        ),
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
      );
      expression.shuffle();
      break;
    case 2:
      expression = new MultiplyNode(
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
      );
      expression.shuffle();
      break;
    case 3:
      expression = new FractionNode(
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
        new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
      );
      expression.shuffle();
      break;
    default:
      expression = new ExpNode(new VariableNode('x'));
  }

  const simplifiedExpression = simplifyNode(expression);
  const answer = simplifiedExpression.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Simplifier l'expression $${expression.toTex()}$.`,
    answer,
    keys: ['x', 'epower', 'exp'],
    answerFormat: 'tex',
    qcmGeneratorProps: { answer, random },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer, random }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    let wrongExpression;
    switch (random) {
      case 1:
        wrongExpression = new FractionNode(
          new MultiplyNode(
            new ExpNode(new Polynomial([0, randint(-9, 10, [0])]).toTree()),
            new ExpNode(new NumberNode(randint(-9, 10, [0]))),
          ),
          new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
        );
        wrongExpression.shuffle();
        break;
      case 2:
        wrongExpression = new MultiplyNode(
          new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
          new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
        );
        wrongExpression.shuffle();
        break;
      case 3:
        wrongExpression = new FractionNode(
          new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
          new ExpNode(new Polynomial([randint(-9, 10), randint(-9, 10, [0])]).toTree()),
        );
        wrongExpression.shuffle();
        break;
      default:
        wrongExpression = new ExpNode(new VariableNode('x'));
    }
    tryToAddWrongProp(propositions, simplifyNode(wrongExpression).toTex());
  }

  return shuffle(propositions);
};

export const expSimplifiying: MathExercise<QCMProps, VEAProps> = {
  id: 'expSimplifiying',
  connector: '\\iff',
  label: "Simplifier des expressions avec l'exponentielle",
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  sections: ['Exponentielle'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpSimplifiying, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
