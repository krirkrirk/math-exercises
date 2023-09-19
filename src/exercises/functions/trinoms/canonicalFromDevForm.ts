import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Integer } from '#root/math/numbers/integer/integer';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { DiscreteSet } from '#root/math/sets/discreteSet';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const canonicalFromDevForm: Exercise = {
  id: 'canonicalFromDevForm',
  connector: '\\iff',
  instruction: '',
  label: 'Déterminer la forme canonique à partir de la forme développée',
  levels: ['1reSpé'],
  isSingleStep: false,
  sections: ['Second degré'],
  generator: (nb: number) => getDistinctQuestions(getCanonicalFromDevFormQuestion, nb),
};

export function getCanonicalFromDevFormQuestion(): Question {
  const trinom = TrinomConstructor.randomCanonical();

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: trinom.getCanonicalForm().toTex(),
      isRightAnswer: true,
      format: 'tex',
    });

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: TrinomConstructor.randomCanonical(new DiscreteSet([new Integer(trinom.a), new Integer(-trinom.a)]))
            .getCanonicalForm()
            .toTex(),
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
    answer: trinom.getCanonicalForm().toTex(),
    keys: ['x', '=', '\\alpha', '\\beta'],
    instruction: `Déterminer la forme canonique de la fonction $f$ définie par $f(x) = ${trinom.toTree().toTex()}$`,
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
