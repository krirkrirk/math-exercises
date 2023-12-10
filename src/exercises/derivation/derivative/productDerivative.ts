import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PolynomialConstructor } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { MultiplyNode } from '#root/tree/nodes/operators/multiplyNode';
import { v4 } from 'uuid';

export const productDerivative: MathExercise<QCMProps, VEAProps> = {
  id: 'productDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'un produit de polynômes",
  levels: ['1reSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Dérivation'],
  generator: (nb: number) => getDistinctQuestions(getProductDerivativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getProductDerivativeQuestion(): Question {
  const poly1 = PolynomialConstructor.randomWithLength(3, 2);
  const poly2 = PolynomialConstructor.randomWithLength(3, 2);
  const answer = poly1.multiply(poly2).derivate().toTree().toTex();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, poly1.derivate().multiply(poly2.derivate()).toTree().toTex());
    tryToAddWrongProp(res, poly1.derivate().add(poly2.derivate()).toTree().toTex());
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = PolynomialConstructor.random(3).toTree().toTex();
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
    answer: answer,
    instruction: `Déterminer la dérivée de la fonction $f$ définie par $f(x) = ${new MultiplyNode(
      poly1.toTree(),
      poly2.toTree(),
    ).toTex()}$`,
    keys: ['x', 'xsquare', 'xcube'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
