import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const constantPrimitive: Exercise = {
  id: 'constantPrimitive',
  connector: '=',
  instruction: '',
  label: "Primitive d'une constante",
  levels: ['1', '0'],
  section: 'Intégration',
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstantPrimitive, nb),
  keys: ['x', 'C'],
};

export function getConstantPrimitive(): Question {
  const c = randint(-9, 10, [0]);

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: `${c}x + C`,
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongAnswer = `${randint(-9, 10)}x + C`;
        proposition = {
          id: v4(),
          statement: wrongAnswer,
          isRightAnswer: false,
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
    answer: `${c}x + C`,
    keys: ['x', 'C'],
    getPropositions,
  };

  return question;
}
