// export enum Connector {
//   equal = "=",
//   equiv = "\\iff",
//   implies = "\\Rightarrow",
// }

export type GeneratorOptions = {};

export type Proposition = {
  id: string;
  statement: string;
  isRightAnswer: boolean;
};
export interface Question {
  instruction?: string;
  startStatement?: string;
  answer: string;
  keys?: string[];
  commands?: string[];
  coords?: number[];
  options?: any;
  getPropositions?: (n: number) => Proposition[];
}

export interface Exercise {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  section: string;
  levels: string[];
  connector: '=' | '\\iff' | '\\approx';
  keys?: string[];
  generator(nb: number, options?: GeneratorOptions): Question[];
}
