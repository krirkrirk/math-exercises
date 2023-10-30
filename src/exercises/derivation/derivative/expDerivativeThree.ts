import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const expDerivativeThree: MathExercise = {
  id: 'expDerivativeThree',
  connector: '=',
  instruction: '',
  label: 'Dérivée de $(ax+b) \\times \\exp(x)$',
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp'],
  sections: ['Dérivation', 'Exponentielle'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpDerivativeThree, nb),
  keys: ['x', 'epower', 'exp'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getExpDerivativeThree(): Question {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const myfunction = new MultiplyNode(new Polynomial([b, a]).toTree(), new ExpNode(new VariableNode('x')));
  const derivative = new MultiplyNode(new Polynomial([b + a, a]).toTree(), new ExpNode(new VariableNode('x')));

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: derivative.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(propositions, new MultiplyNode(new NumberNode(a), new ExpNode(new VariableNode('x'))).toTex());
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(new Polynomial([b + a, -a]).toTree(), new ExpNode(new VariableNode('x'))).toTex(),
    );
    tryToAddWrongProp(propositions, a + '');
    tryToAddWrongProp(
      propositions,
      simplifyNode(
        new MultiplyNode(
          new MultiplyNode(new NumberNode(a), new VariableNode('x')),
          new ExpNode(new VariableNode('x')),
        ),
      ).toTex(),
    );

    return shuffleProps(propositions, numOptions);
  };

  const question: Question = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()}$.`,
    startStatement: "f'(x)",
    answer: derivative.toTex(),
    keys: ['x', 'epower', 'exp'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
