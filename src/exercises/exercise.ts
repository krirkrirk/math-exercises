import { KeyId } from 'react-math-keyboard';

export type GeneratorOptions = {};

export type Proposition = {
  id: string;
  statement: string;
  isRightAnswer: boolean;
  format: 'tex' | 'raw';
};
export interface Question {
  instruction?: string;
  startStatement?: string;
  answer: string;
  answerFormat: 'tex' | 'raw';
  keys?: KeyId[];
  commands?: string[];
  coords?: number[];
  options?: any;
  getPropositions: (n: number) => Proposition[];
}

export interface Exercise {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  sections: MathSection[];
  levels: MathLevel[];
  connector?: '=' | '\\iff' | '\\approx';
  keys?: string[];
  generator(nb: number, options?: GeneratorOptions): Question[];
  answerType?: 'QCM' | 'free';
  qcmTimer: number;
  freeTimer: number;
}

export type MathLevel =
  | '6ème'
  | '5ème'
  | '4ème'
  | '3ème'
  | '2nde'
  | '1reTech'
  | '1reESM'
  | '1reSpé'
  | 'TermSpé'
  | 'TermTech'
  | 'MathExp'
  | 'MathComp'
  | 'CAP'
  | '2ndPro'
  | '1rePro'
  | 'TermPro';

export type MathSection =
  | 'Arithmétique'
  | 'Calcul littéral'
  | 'Calculs'
  | 'Conversions'
  | 'Dérivation'
  | 'Droites'
  | 'Équations'
  | 'Équations différentielles'
  | 'Exponentielle'
  | 'Fonction cube'
  | 'Fonction inverse'
  | 'Fonctions'
  | 'Fonctions affines'
  | 'Fonctions de référence'
  | 'Fractions'
  | 'Géométrie cartésienne'
  | 'Géométrie euclidienne'
  | 'Inéquations'
  | 'Intégration'
  | 'Intervalles'
  | 'Limites'
  | 'Logarithme népérien'
  | 'Nombres complexes'
  | 'Pourcentages'
  | 'Primitives'
  | 'Probabilités'
  | 'Proportionnalité'
  | 'Puissances'
  | 'Racines carrées'
  | 'Second degré'
  | 'Statistiques'
  | 'Suites'
  | 'Trigonométrie'
  | 'Vecteurs';
