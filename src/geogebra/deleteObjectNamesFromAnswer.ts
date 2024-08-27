export const deleteObjectNamesFromAnswer = (answer: string[]) => {
  return answer.map((s) => s.replace(/[^=]+= * /, ""));
};
