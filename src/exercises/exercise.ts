// export enum Connector {
//   equal = "=",
//   equiv = "\\iff",
//   implies = "\\Rightarrow",
// }

export interface Question {
  instruction?: string;
  startStatement?: string;
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
}
