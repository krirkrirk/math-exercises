import { Question } from "../exercise";
export const getDistinctQuestions = (generator: Function, nb: number): Question[] => {
  const res: Question[] = [];

  for (let i = 0; i < nb; i++) {
    let question: Question;

    do {
      question = generator();
    } while (res.some((q) => q.startStatement === question.startStatement));
    res.push(question);
  }
  return res;
};
