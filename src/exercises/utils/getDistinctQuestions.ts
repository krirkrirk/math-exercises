import { number } from 'mathjs';
import { Question } from '../exercise';

export function equalTab<T>(array1: T[], array2: T[]) {
  if (!array1 || !array2) return false;
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++) if (array1[i] !== array2[i]) return false;
  return true;
}

export const getDistinctQuestions = (generator: Function, nb: number): Question[] => {
  const res: Question[] = [];

  for (let i = 0; i < nb; i++) {
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
