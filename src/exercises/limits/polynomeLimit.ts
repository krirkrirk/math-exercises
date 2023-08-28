import { createRandomPolynomialWithOrder } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { Exercise, Proposition, Question } from '../exercise';
import { getDistinctQuestions } from '../utils/getDistinctQuestions';
import { v4 } from 'uuid';

export const polynomeLimit: Exercise = {
  id: 'polynomeLimit',
  connector: '=',
  instruction: '',
  label: "Calculer la limite d'une fonction polynomiale",
  levels: ['2', '1', '0'],
  section: 'Limites',
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getApplyPercentQuestion, nb),
  keys: ['infty'],
};

export function getApplyPercentQuestion(): Question {
  const polynome1 = createRandomPolynomialWithOrder(randint(2, 6));
  const polynome2 = createRandomPolynomialWithOrder(randint(2, 6));

  // a_1x^n + b_2x^(n-1) + ...
  const a1 = polynome1.coefficients[polynome1.coefficients.length - 1];
  const a2 = polynome2.coefficients[polynome2.coefficients.length - 1];

  const rand = coinFlip(); // polynome ou fraction
  const randLimite = coinFlip() ? 1 : -1; // + infini ou - infini

  let instruction = '';
  let answer = '';

  if (rand) {
    instruction = `Déterminer la limite en $${
      randLimite > 0 ? `+` : `-`
    } \\infty$ de la fonction $f$ définie par : $f(x)$ = $${polynome1.toTex()}$.`;
    answer = a1 * randLimite ** polynome1.degree > 0 ? `+\\infty` : `-\\infty`;
  } else {
    instruction = `Déterminer la limite en $${
      randLimite > 0 ? `+` : `-`
    } \\infty$ de la fonction $f$ définie par : $f(x)$ = $${new FractionNode(
      polynome1.toTree(),
      polynome2.toTree(),
    ).toTex()}$.`;
    if (polynome1.degree > polynome2.degree) answer = a1 * randLimite > 0 ? `+\\infty` : `-\\infty`;
    else if (polynome2.degree > polynome1.degree) answer = '0';
    else answer = simplifyNode(new FractionNode(new NumberNode(a1), new NumberNode(a2))).toTex();
  }

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];
    let wrongAnswer = '';
    let k = n - 1;

    res.push({
      id: v4() + '',
      statement: answer,
      isRightAnswer: true,
    });

    wrongAnswer = `+\\infty`;
    if (k > 0 && answer !== wrongAnswer) {
      res.push({
        id: v4() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
      k--;
    }

    wrongAnswer = `-\\infty`;
    if (k > 0 && answer !== wrongAnswer) {
      res.push({
        id: v4() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
      k--;
    }

    wrongAnswer = `0`;
    if (k > 0 && answer !== wrongAnswer) {
      res.push({
        id: v4() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
      k--;
    }

    wrongAnswer = simplifyNode(new FractionNode(new NumberNode(a1), new NumberNode(a2))).toTex();
    if (!rand && k > 0 && answer !== wrongAnswer) {
      res.push({
        id: v4() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
      k--;
    }

    wrongAnswer = `${a1}`;
    if (k > 0 && answer !== wrongAnswer) {
      res.push({
        id: v4() + '',
        statement: wrongAnswer,
        isRightAnswer: false,
      });
      k--;
    }

    for (let i = 0; i < k; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: randint(-9, 10) + '',
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction,
    answer,
    keys: ['infty'],
    getPropositions,
  };

  return question;
}
