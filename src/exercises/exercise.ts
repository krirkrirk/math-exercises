// export enum Connector {
//   equal = "=",
//   equiv = "\\iff",
//   implies = "\\Rightarrow",
// }

export interface Question {
  startStatement: string;
  answer: string;
}

export interface Exercise {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  section: string;
  levels: string[];
  connector: string;
  generator(nb: number): Question[];
  // questions: Question[];
  // constructor({ generatorType, questionsNumber }: ExerciseParameters) {

  // }
}
