import { Question } from '../exercise';

export function equalTab<T>(array1: T[], array2: T[]) {
  if (!array1 && !array2) return true;
  if (!array1 || !array2) return false;
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) if (array1[i] !== array2[i]) return false;
  return true;
}

/**
 *
 * @param generator
 * @param nb
 * @param max included
 * @returns
 */
export const getDistinctQuestions = (generator: () => Question, nb: number, max?: number): Question[] => {
  const res: Question[] = [];
  const trueStop = max === undefined ? nb : nb > max ? max : nb;

  for (let i = 0; i < trueStop ?? nb; i++) {
    let question: Question;
    do {
      question = generator();
    } while (
      res.some(
        (q) =>
          q.instruction === question.instruction &&
          q.startStatement === question.startStatement &&
          equalTab(q.commands!, question.commands!),
      )
    );
    res.push(question);
  }
  return res;
};
