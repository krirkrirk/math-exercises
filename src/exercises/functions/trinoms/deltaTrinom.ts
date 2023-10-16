import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const deltaTrinom: Exercise = {
  id: 'deltaTrinom',
  connector: '=',
  instruction: '',
  label: "Calculer le discriminant d'un trinôme",
  levels: ['1reSpé', 'TermSpé', 'MathComp'],
  isSingleStep: true,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getDeltaTrinomQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDeltaTrinomQuestion(): Question {
  const trinom = TrinomConstructor.random();
  const answer = trinom.getDelta();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer + '',
      isRightAnswer: true,
      format: 'tex',
    });
    const bMinus4ac = trinom.b - 4 * trinom.a * trinom.c;
    if (bMinus4ac !== answer)
      res.push({
        id: v4(),
        statement: bMinus4ac + '',
        isRightAnswer: false,
        format: 'tex',
      });
    const bSquarePlus4ac = trinom.b ** 2 + trinom.a * trinom.c;
    if (bSquarePlus4ac !== answer && bSquarePlus4ac !== bMinus4ac)
      res.push({
        id: v4(),
        statement: bSquarePlus4ac + '',
        isRightAnswer: false,
        format: 'tex',
      });
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

    return shuffle(res);
  };

  const question: Question = {
    answer: answer + '',
    instruction: `Soit $f(x) = ${trinom.toTree().toTex()}$. Calculer le discriminant $\\Delta$.`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
