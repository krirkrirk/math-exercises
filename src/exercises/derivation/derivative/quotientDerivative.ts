import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { v4 } from 'uuid';

export const quotientDerivative: MathExercise = {
  id: 'quotientDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'un quotient de polynômes",
  levels: ['1reSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Dérivation'],
  generator: (nb: number) => getDistinctQuestions(getProductDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getProductDerivativeQuestion(): Question {
  const poly1 = PolynomialConstructor.randomWithLength(2, 2);
  const poly2 = PolynomialConstructor.randomWithLength(2, 2);
  const answerNum = poly1.derivate().multiply(poly2).add(poly1.opposite().multiply(poly2.derivate())).toTree().toTex();
  const answerDenum = new PowerNode(poly2.toTree(), new NumberNode(2)).toTex();
  const answer = `\\frac{${answerNum}}{${answerDenum}}`;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(res, `\\frac{${poly1.derivate().toTree().toTex()}}{${poly2.derivate().toTree().toTex()}}`);
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = `\\frac{${PolynomialConstructor.random(2).toTree().toTex()}}{${answerDenum}}`;
        proposition = {
          id: v4() + ``,
          statement: wrongAnswer,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffleProps(res, n);
  };

  const question: Question = {
    answer,
    instruction: `Déterminer la dérivée de la fonction $f$ définie par $f(x) = ${new FractionNode(
      poly1.toTree(),
      poly2.toTree(),
    ).toTex()}$`,
    keys: ['x', 'xsquare', 'xcube'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
