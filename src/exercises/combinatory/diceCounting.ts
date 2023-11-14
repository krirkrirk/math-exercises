import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { v4 } from 'uuid';

export const diceCounting: MathExercise = {
  id: 'diceCounting',
  connector: '=',
  instruction: '',
  label: 'Dénombrement avec des dés',
  levels: ['TermSpé'],
  isSingleStep: true,
  sections: ['Combinatoire et dénombrement'],
  generator: (nb: number) => getDistinctQuestions(getDiceCountingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getDiceCountingQuestion(): Question {
  const type = randint(0, 8);
  let instruction = '';
  let answer = '';
  let face1: number, face2: number, face3: number;
  switch (type) {
    case 0:
      instruction = `avec exactement deux chiffres identiques`;
      answer = 6 * 3 * 5 + '';
      break;
    case 1:
      instruction = `avec trois chiffres identiques`;
      answer = 6 + '';
      break;
    case 2:
      face1 = randint(1, 7);
      instruction = `avec exactement une fois la face ${face1}`;
      answer = 3 * 5 * 5 + '';
      break;
    case 3:
      face1 = randint(1, 7);
      instruction = `avec exactement deux fois la face ${face1}`;
      answer = 3 * 5 + '';
      break;
    case 4:
      face1 = randint(1, 7);
      face2 = randint(1, 7, [face1]);
      face3 = randint(1, 7, [face1, face2]);
      instruction = `avec exactement les faces ${face1}, ${face2} et ${face3}`;
      answer = 6 + '';
      break;
    case 5:
      face1 = randint(1, 7);
      face2 = randint(1, 7, [face1]);
      face3 = randint(1, 7, [face1, face2]);
      instruction = `avec exactement une fois la face ${face1} et une fois la face ${face2}`;
      answer = 3 * 5 + '';
      break;
    case 6:
      instruction = `dans lesquels toutes les faces sont différentes`;
      answer = 6 * 5 * 4 + '';
      break;
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
        tryToAddWrongProp(res, 3 * 5 + '');
        tryToAddWrongProp(res, 6 * 6 * 3 + '');
        tryToAddWrongProp(res, 6 * 3 + '');
        break;
      case 1:
        tryToAddWrongProp(res, 6 * 3 + '');
        tryToAddWrongProp(res, 1 + '');
        break;
      case 2:
        tryToAddWrongProp(res, 3 * 6 * 6 + '');
        tryToAddWrongProp(res, 6 + '');
        tryToAddWrongProp(res, 5 * 5 + '');
        break;
      case 3:
        tryToAddWrongProp(res, 6 * 3 + '');
        tryToAddWrongProp(res, 6 * 5 + '');
        tryToAddWrongProp(res, 5 + '');
        break;
      case 4:
        tryToAddWrongProp(res, 3 + '');
        tryToAddWrongProp(res, 1 + '');
        tryToAddWrongProp(res, 6 * 6 * 6 + '');
        break;
      case 5:
        tryToAddWrongProp(res, 6 * 3 + '');
        tryToAddWrongProp(res, 6 * 5 + '');
        tryToAddWrongProp(res, 5 + '');
        break;
      case 6:
        tryToAddWrongProp(res, 6 * 6 * 6 + '');
        tryToAddWrongProp(res, 6 * 5 + '');
        tryToAddWrongProp(res, 6 + '');
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
    instruction: `On tire 3 fois consécutivement un dé à six faces numérotées de 1 à 6. Combien de tirages ${instruction} sont possibles ?`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
