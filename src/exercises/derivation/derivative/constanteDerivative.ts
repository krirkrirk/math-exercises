import { Exercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const constanteDerivative: Exercise = {
  id: 'constanteDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une constante",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', '1rePro'],
  sections: ['Dérivation'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstanteDerivative, nb),
  keys: ['x'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getConstanteDerivative(): Question {
  const c = randint(-9, 10, [0]);

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: 0 + '',
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(propositions, c + '');
    tryToAddWrongProp(propositions, '1');
    tryToAddWrongProp(propositions, -c + '');

    const missing = n - propositions.length;

    for (let i = 0; i < missing; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(-9, 10);
        proposition = {
          id: v4(),
          statement: wrongAnswer + '',
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
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) = ${c}$.`,
    startStatement: `f'(x)`,
    answer: '0',
    keys: ['x'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
