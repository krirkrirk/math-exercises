// export enum Connector {
//   equal = "=",
//   equiv = "\\iff",
//   implies = "\\Rightarrow",
// }

export type GeneratorOptions = {};

export interface Question {
  instruction?: string;
  startStatement?: string;
  answer: string;
  keys?: string[];
  commands?: string[];
  coords?: number[];
}

export interface Exercise {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  section: string;
  levels: string[];
  connector: '=' | '\\iff' | '\\approx';
  generator(nb: number, options?: GeneratorOptions): Question[];
}
