export const deleteObjectNamesFromAnswer = (answers: string[]) => {
  return answers.map((s) => s.replace(/^[^=]*=\s*/, ""));
};
