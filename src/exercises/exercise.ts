import { KeyId } from '#root/types/keyIds';
import { shuffle } from '#root/utils/shuffle';
import { uuid } from 'uuidv4';

export const tryToAddWrongProp = (props: Proposition[], statement: string, format: 'tex' | 'raw' = 'tex') => {
  if (!props.some((prop) => prop.statement === statement)) {
    props.push({
      id: uuid(),
      statement,
      isRightAnswer: false,
      format: format,
    });
  }
};

export const shuffleProps = (props: Proposition[], n: number) => {
  return shuffle([props[0], ...shuffle(props.slice(1)).slice(0, n - 1)]);
};
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
  divisionFormat?: 'fraction' | 'obelus';
  getPropositions: (n: number) => Proposition[];
}

export interface MathExercise {
  id: string;
  instruction: string;
  isSingleStep: boolean;
  label: string;
  sections: MathSection[];
  levels: MathLevel[];
  connector?: '=' | '\\iff' | '\\approx';
  keys?: KeyId[];
  generator(nb: number, options?: GeneratorOptions): Question[];
  maxAllowedQuestions?: number;
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
  | 'Ensembles et intervalles'
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
