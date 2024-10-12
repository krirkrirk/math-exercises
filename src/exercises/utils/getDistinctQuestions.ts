import { Question } from "../exercise";

export function equalTab<T>(array1: T[], array2: T[]) {
  if (!array1 && !array2) return true;
  if (!array1 || !array2) return false;
  if (array1.length !== array2.length) return false;
  for (let i = 0; i < array1.length; i++)
    if (array1[i] !== array2[i]) return false;
  return true;
}

/**
 *
 * @param generator
 * @param nb
 * @param max included
 * @returns
 */
export const getDistinctQuestions = (
  generator: () => Question<any>,
  nb: number,
  max?: number,
  discriminator?: (q1: Question<any>, q2: Question<any>) => boolean,
): Question<any>[] => {
  const res: Question<any>[] = [];
  const trueStop = max === undefined ? nb : Math.min(nb, max);

  for (let i = 0; i < trueStop ?? nb; i++) {
    let question: Question<any>;
    do {
      question = generator();
    } while (res.some((q) => compare(q, question, discriminator)));

    res.push(question);
  }
  return res;
};

const compare = (
  q1: Question<any>,
  q2: Question<any>,
  discriminator?: (q1: Question<any>, q2: Question<any>) => boolean,
) => {
  if (!!discriminator) {
    return discriminator(q1, q2);
  }
  return (
    q1.instruction === q2.instruction &&
    q1.answer === q2.answer &&
    (!q1.ggbOptions?.commands ||
      equalTab(q1.ggbOptions?.commands, q2.ggbOptions?.commands!))
  );
};
