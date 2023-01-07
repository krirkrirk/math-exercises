// export enum Connector {
//   equal = "=",
//   equiv = "\\iff",
//   implies = "\\Rightarrow",
// }

export interface Question {
  statement: string;
  answer: string;
}

export interface Exercise {
  instruction: string;
  label: string;
  section: string;
  levels: string[];
  connector: string;
  generator(nb: number): Question[];
  // questions: Question[];
  // constructor({ generatorType, questionsNumber }: ExerciseParameters) {

  // }
}
