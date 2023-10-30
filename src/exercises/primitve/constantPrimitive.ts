import { MathExercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { Monom } from '#root/math/polynomials/monom';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const constantPrimitive: MathExercise = {
  id: 'constantPrimitive',
  connector: '=',
  instruction: '',
  label: "Primitive d'une constante",
  levels: ['TermSpé', 'MathComp'],
  sections: ['Primitives'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstantPrimitive, nb),
  keys: ['x', 'C'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getConstantPrimitive(): Question {
  const c = randint(-19, 20, [0]);
  const monom = new Monom(1, c);
  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: `${monom.toTex()} + C`,
      isRightAnswer: true,
      format: 'tex',
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongAnswer = `${randint(-9, 10, [-1, 0, 1])}x + C`;
        proposition = {
          id: v4(),
          statement: wrongAnswer,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = propositions.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      propositions.push(proposition);
    }

    return shuffle(propositions);
  };

  const question: Question = {
    instruction: `Déterminer la forme générale des primitives de la fonction constante $f$ définie par $f(x) = ${c}$.`,
    startStatement: `F(x)`,
    answer: `${monom.toTex()}+C`,
    keys: ['x', 'C'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
