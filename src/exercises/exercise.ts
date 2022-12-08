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
  questions: Question[];
  // constructor({ generatorType, questionsNumber }: ExerciseParameters) {

  // }
}
