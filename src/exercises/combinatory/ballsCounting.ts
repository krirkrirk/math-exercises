import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { v4 } from 'uuid';

export const ballsCounting: MathExercise = {
  id: 'ballsCounting',
  connector: '=',
  instruction: '',
  label: 'Dénombrement avec des boules',
  levels: ['TermSpé'],
  isSingleStep: true,
  sections: ['Combinatoire et dénombrement'],
  generator: (nb: number) => getDistinctQuestions(getBallsCountingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getBallsCountingQuestion(): Question {
  const type = randint(0, 6);
  let instruction = '';
  let answer = '';
  const blacks = randint(2, 6);
  const greens = randint(2, 6);
  const reds = randint(3, 6);
  const total = blacks + greens + reds;
  switch (type) {
    case 0:
      instruction = ``;
      answer = total * (total - 1) * (total - 2) + '';
      break;
    case 1:
      instruction = `comportant trois boules rouges`;
      answer = reds * (reds - 1) * (reds - 2) + '';
      break;
    case 2:
      instruction = `ne comportant pas de boule noire`;
      answer = (reds + greens) * (reds + greens - 1) * (reds + greens - 2) + '';
      break;
    case 3:
      instruction = `comportant au moins une boule noire`;
      answer = total * (total - 1) * (total - 2) - (reds + greens) * (reds + greens - 1) * (reds + greens - 2) + '';
      break;
    case 4:
      instruction = `comportant trois boules de trois couleurs différentes`;
      answer = 6 * (blacks * greens * reds) + '';
      break;
    case 5:
      instruction = `comportant exactement une boule verte et deux boules noires`;
      answer = 6 * (greens * blacks * (blacks - 1)) + '';
      break;
    case 6:
      instruction = `comportant exactement une boule verte`;
      answer = 6 * greens * (reds + blacks) * (reds + blacks - 1) + '';
  }
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    switch (type) {
      case 0:
        tryToAddWrongProp(res, total * total * total + '');
        tryToAddWrongProp(res, 6 + '');
        break;
      case 1:
        tryToAddWrongProp(res, reds * reds * reds + '');
        tryToAddWrongProp(res, 1 + '');
        break;
      case 2:
        tryToAddWrongProp(res, (reds + greens) * (reds + greens) * (reds + greens) + '');
        tryToAddWrongProp(res, 6 * blacks * (reds + greens) * (reds + greens - 1) + '');
        break;
      case 3:
        tryToAddWrongProp(res, (reds + greens) * (reds + greens) * (reds + greens) + '');
        tryToAddWrongProp(res, 3 * (reds + greens) * (reds + greens - 1) + '');
        break;
      case 4:
        tryToAddWrongProp(res, blacks * greens * reds + '');
        tryToAddWrongProp(res, 6 + '');
        break;
      case 5:
        tryToAddWrongProp(res, 6 * greens * blacks * blacks + '');
        tryToAddWrongProp(res, 6 + '');
        break;
      case 6:
        tryToAddWrongProp(res, 6 * (blacks * greens * reds) + '');
        tryToAddWrongProp(res, greens * (reds + blacks) * (reds + blacks - 1) + '');
        break;
    }
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(1, 100) + '';
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
    instruction: `Une urne contient ${blacks} boules noires numérotées de 1 à ${blacks}, ${reds} boules rouges numérotées de 1 à ${reds} et ${greens} boules vertes numérotées de 1 à ${greens}.
    On tire successivement et sans remise 3 boules dans l'urne. 
    Combien de tirages ${instruction} sont possibles ?`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
