import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const expDerivativeOne: MathExercise = {
  id: 'expDerivativeOne',
  connector: '=',
  instruction: '',
  label: 'Dérivée de $\\exp(ax + b)$',
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', 'TermSpé'],
  sections: ['Dérivation', 'Exponentielle'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getExpDerivative, nb),
  keys: ['x', 'epower', 'exp'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getExpDerivative(): Question {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const affine = new Polynomial([b, a]);
  const myfunction = new ExpNode(affine.toTree());
  const derivative = simplifyNode(new MultiplyNode(new NumberNode(a), myfunction));

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: derivative.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(propositions, myfunction.toTex());
    tryToAddWrongProp(propositions, simplifyNode(new MultiplyNode(affine.toTree(), myfunction)).toTex());
    tryToAddWrongProp(propositions, new ExpNode(new NumberNode(a)).toTex());
    tryToAddWrongProp(propositions, simplifyNode(new MultiplyNode(new NumberNode(b), myfunction)).toTex());
    while (propositions.length < numOptions)
      tryToAddWrongProp(
        propositions,
        simplifyNode(new MultiplyNode(new NumberNode(randint(-9, 10)), myfunction)).toTex(),
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
