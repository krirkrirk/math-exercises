import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { ExpNode } from '#root/tree/nodes/functions/expNode';
import { LogNode } from '#root/tree/nodes/functions/logNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const lnDerivativeOne: MathExercise<QCMProps, VEAProps> = {
  id: 'lnDerivativeOne',
  connector: '=',
  instruction: '',
  label: 'Dérivée de $\\ln(ax + b)$',
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', 'TermSpé'],
  sections: ['Dérivation', 'Logarithme népérien'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLnDerivative, nb),
  keys: ['ln'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getLnDerivative(): Question {
  const a = randint(-9, 10, [0]);
  const b = randint(-9, 10);

  const polynom = new Polynomial([b, a]);
  const derivative = simplifyNode(new FractionNode(new NumberNode(a), polynom.toTree()));
  const logTree = new LogNode(polynom.toTree());
  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: derivative.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(propositions, simplifyNode(new MultiplyNode(new NumberNode(a), logTree)).toTex());
    tryToAddWrongProp(propositions, a + '');
    tryToAddWrongProp(propositions, new ExpNode(polynom.toTree()).toTex());
    tryToAddWrongProp(propositions, polynom.toTree().toTex());
    tryToAddWrongProp(propositions, `\\frac{${a}}{${logTree.toTex()}}`);
    tryToAddWrongProp(propositions, `\\frac{1}{${polynom.toTree().toTex()}}`);

    return shuffleProps(propositions, numOptions);
  };

  const question: Question = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${logTree.toTex()}$.`,
    startStatement: "f'(x)",
    answer: derivative.toTex(),
    keys: ['x', 'ln', 'epower'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
