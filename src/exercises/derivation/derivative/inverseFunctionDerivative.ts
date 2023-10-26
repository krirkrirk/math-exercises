import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const inverseFunctionDerivative: MathExercise = {
  id: 'inverseFunctionDerivative',
  connector: '=',
  instruction: '',
  label: "Dérivée d'une fonction inverse",
  levels: ['1reESM', '1reSpé', '1reTech', 'MathComp', 'TermTech'],
  sections: ['Dérivation', 'Fonction inverse'],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getInverseFunctionDerivative, nb),
  keys: ['x'],
  qcmTimer: 60,
  freeTimer: 60,
};

export function getInverseFunctionDerivative(): Question {
  const a = randint(-19, 20, [0]);

  const getPropositions = (n: number) => {
    const propositions: Proposition[] = [];

    propositions.push({
      id: v4(),
      statement: `\\frac{${-a}}{x^2}`,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(propositions, `\\frac{${a}}{x^2}`);
    tryToAddWrongProp(propositions, `\\frac{${a}}{x}`);
    tryToAddWrongProp(propositions, `${a}`);
    tryToAddWrongProp(propositions, `\\frac{${2 * a}}{x}`);

    const missing = n - propositions.length;

    for (let i = 0; i < missing; i++) {
      let isDuplicate;
      let proposition: Proposition;

      do {
        const wrongAnswer = `\\frac{${randint(-9, 10, [0, -a])}}{x^2}`;
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

    return shuffleProps(propositions, n);
  };

  const question: Question = {
    instruction: `Déterminer la fonction dérivée $f'$ de la fonction $f$ définie par $f(x) =\\frac{${a}}{x}$.`,
    startStatement: `f'(x)`,
    answer: `\\frac{${-a}}{x^2}`,
    keys: ['x'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
