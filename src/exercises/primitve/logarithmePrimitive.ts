import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial, createRandomPolynomialWithOrder } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const logarithmePrimitive: Exercise = {
  id: 'logarithmePrimitive',
  connector: '=',
  instruction: '',
  label: 'Primitive de la fonction logarithme',
  levels: ['1', '0'],
  section: 'Intégration',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getLogarithmePrimitive, nb),
  keys: ['x', 'C', 'ln', 'abs'],
};

export function getLogarithmePrimitive(): Question {
  const u = createRandomPolynomialWithOrder(randint(1, 3));

  const selectedFunction = new FractionNode(u.derivate().toTree(), u.toTree());
  const integratedFuction = `ln\|${u.toTex()}\|`;

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: `${integratedFuction} + C`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;
      let wrongIntegral;

      do {
        const wrongIntegrals = [
          new FractionNode(u.derivate().toTree(), new PowerNode(u.toTree(), new NumberNode(2))).toTex(),
          new FractionNode(
            u
              .derivate()
              .multiply(new Polynomial([-1]))
              .toTree(),
            new PowerNode(u.toTree(), new NumberNode(2)),
          ).toTex(),
          `ln(${new PowerNode(u.toTree(), new NumberNode(2)).toTex()})`,
          new PowerNode(u.toTree(), new NumberNode(2)).toTex(),
          `ln\|${createRandomPolynomialWithOrder(randint(1, 3)).toTex()}\|`,
        ];
        wrongIntegral = wrongIntegrals[randint(0, wrongIntegrals.length)];

        proposition = {
          id: v4(),
          statement: `${wrongIntegral} + C`,
          isRightAnswer: false,
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la forme générale des primitives de la fonction f définie par $f(x) = ${simplifyNode(
      selectedFunction,
    ).toTex()}$.`,
    startStatement: `F(x)`,
    answer: `${integratedFuction} + C`,
    keys: ['x', 'C', 'ln', 'abs'],
    getPropositions,
  };

  return question;
}
