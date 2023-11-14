import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { PointConstructor } from '#root/math/geometry/point';
import { IntegerConstructor } from '#root/math/numbers/integer/integer';
import { v4 } from 'uuid';

export const coordinatesReading: MathExercise = {
  id: 'coordinatesReading',
  connector: '=',
  instruction: '',
  label: "Lire les coordonnées d'un vecteur",
  levels: ['2nde', '1reESM'],
  isSingleStep: true,
  sections: ['Vecteurs'],
  generator: (nb: number) => getDistinctQuestions(getCoordinatesReadingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getCoordinatesReadingQuestion(): Question {
  const [xA, yA] = IntegerConstructor.randomDifferents(-5, 6, 2);
  let xB: number, yB: number;
  do {
    [xB, yB] = IntegerConstructor.randomDifferents(-5, 6, 2);
  } while (xA === xB && yA === yB);

  const xDelta = xB - xA;
  const yDelta = yB - yA;
  const answer = `\\left(${xDelta};${yDelta}\\right)`;

  const commands = [`Vector((${xA},${yA}), (${xB}, ${yB}))`];
  const xMin = Math.min(xA, xB);
  const yMin = Math.min(yA, yB);
  const xMax = Math.max(xA, xB);
  const yMax = Math.max(yA, yB);
  const coords = [
    xMin === xMax ? xMin - 1 : xMin - 0.2 * Math.abs(xDelta),
    xMin === xMax ? xMax + 1 : xMax + 0.2 * Math.abs(xDelta),
    yMin === yMax ? yMin - 1 : yMin - 0.2 * Math.abs(yDelta),
    yMin === yMax ? yMax + 1 : yMax + 0.2 * Math.abs(yDelta),
  ];
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });
    tryToAddWrongProp(res, `\\left(${xA - xB};${yA - yB}\\right)`);
    tryToAddWrongProp(res, `\\left(${xA + xB};${yA + yB}\\right)`);
    tryToAddWrongProp(res, `\\left(${xA - yA};${xB - yB}\\right)`);
    tryToAddWrongProp(res, `\\left(${yA - xA};${yB - xB}\\right)`);

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = '';
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
    instruction: `Lire les coordonnées du vecteur $\\overrightarrow u$ représentée ci-dessous :`,
    keys: ['semicolon', 'u', 'overrightarrow', 'equal'],
    getPropositions,
    answerFormat: 'tex',
    commands,
    coords,
  };

  return question;
}
