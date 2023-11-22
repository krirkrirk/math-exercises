import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Polynomial } from '#root/math/polynomials/polynomial';
import { randint } from '#root/math/utils/random/randint';
import { v4 } from 'uuid';

export const recurrenceFormulaUsage: MathExercise = {
  id: 'recurrenceFormulaUsage',
  connector: '=',
  instruction: '',
  label: "Utiliser la formule de récurrence d'une suite",
  levels: ['1reESM', '1reSpé', '1reTech'],
  isSingleStep: true,
  sections: ['Suites'],
  generator: (nb: number) => getDistinctQuestions(getRecurrenceFormulaUsageQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getRecurrenceFormulaUsageQuestion(): Question {
  const coeffs = [randint(-5, 6), randint(-5, 6), randint(-3, 4, [0])];
  const u = new Polynomial(coeffs, 'u_n');
  const u0 = randint(-2, 3, [0]);
  const rank = randint(1, 4);
  let currentValue = u0;
  for (let i = 0; i < rank; i++) {
    currentValue = u.calculate(currentValue);
  }
  const answer = currentValue + '';
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer + '',
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, u.calculate(rank) + '');
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-100, 100) + '';
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
    answer: answer + '',
    instruction: `Soit $u$ la suite définie par $u_0 = ${u0}$ et pour tout $n\\geq 1$, $u_{n+1} = ${u
      .toTree()
      .toTex()}$. Calculer $u_${rank}$.`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
