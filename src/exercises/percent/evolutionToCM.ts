import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';
import { coinFlip } from '#root/utils/coinFlip';
import { v4 } from 'uuid';

export const evolutionToCM: MathExercise = {
  id: 'evolutionToCM',
  connector: '=',
  instruction: '',
  label: "Passer d'évolution en pourcentage au coefficient multiplicateur",
  levels: ['2ndPro', '2nde', '1rePro', '1reTech', '1reESM'],
  isSingleStep: true,
  sections: ['Pourcentages'],
  generator: (nb: number) => getDistinctQuestions(getEvolutionToCmQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getEvolutionToCmQuestion(): Question {
  const isFromEvolutionToCM = coinFlip();
  const evolution = randint(-99, 101, [0]);
  const isHausse = evolution > 0;
  const CM = (round(1 + evolution / 100, 2) + '').replaceAll('.', ',');
  const answer = isFromEvolutionToCM ? CM : (isHausse ? '+' : '') + evolution + '\\%';
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    if (isFromEvolutionToCM) {
      tryToAddWrongProp(res, (round(evolution / 100, 2) + '').replaceAll('.', ','));
      tryToAddWrongProp(res, evolution + '');
    } else {
      tryToAddWrongProp(res, '+' + (round(1 + evolution / 100, 2) * 100 + '\\%').replaceAll('.', ','));
    }
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = isFromEvolutionToCM
          ? (round(randint(1, 200) / 100, 2) + '').replaceAll('.', ',')
          : (coinFlip() ? '+' : '-') + randint(1, 100) + '\\%';
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
    instruction: isFromEvolutionToCM
      ? `Quel est le coefficient multiplicateur associé à une ${isHausse ? 'hausse' : 'baisse'} de $${
          isHausse ? evolution : evolution.toString().slice(1)
        }\\%$ ?`
      : `Quelle est l'évolution en pourcentage associée à un coefficient multiplicateur de $${CM}$ ?`,
    keys: ['percent'],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
