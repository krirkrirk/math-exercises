import { Exercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { LogNode } from '#root/tree/nodes/functions/logNode';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const lnDerivativeThree: Exercise = {
  id: 'lnDerivativeThree',
  connector: '=',
  instruction: '',
  label: 'Dérivée de $\\ln(x) \\times (ax+b)$',
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
  const affine = new Polynomial([b, a]).toTree();
  const myfunction = new MultiplyNode(affine, new LogNode(new VariableNode('x')));

  const derivative = simplifyNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), new LogNode(new VariableNode('x'))),
      new FractionNode(affine, new VariableNode('x')),
    ),
  );

  const getPropositions = (numOptions: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: derivative.toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(propositions, new FractionNode(new NumberNode(a), new VariableNode('x')).toTex());
    tryToAddWrongProp(propositions, new FractionNode(affine, new VariableNode('x')).toTex());
    if (a === 1) tryToAddWrongProp(propositions, '\\ln\\left(x\\right)');
    else tryToAddWrongProp(propositions, `${a}\\ln\\left(x\\right)`);

    const missing = numOptions - propositions.length;

    for (let i = 0; i < missing; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const randomA = randint(-9, 10, [0]);
        const randomB = randint(-9, 10);

        proposition = {
          id: v4(),
          statement: simplifyNode(
            new AddNode(
              new MultiplyNode(new NumberNode(randomA), new LogNode(new VariableNode('x'))),
              new FractionNode(new Polynomial([randomB, randomA]).toTree(), new VariableNode('x')),
            ),
          ).toTex(),
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions).slice(0, numOptions);
  };

  const question: Question = {
    instruction: `Déterminer la dérivée de la fonction $f(x) = ${myfunction.toTex()} $.`,
    startStatement: "f'(x)",
    answer: derivative.toTex(),
    keys: ['x', 'ln', 'epower'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
