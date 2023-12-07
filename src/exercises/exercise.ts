import { KeyId } from '#root/types/keyIds';
import { shuffle } from '#root/utils/shuffle';
import { uuid } from 'uuidv4';

export const addValidProp = (props: Proposition[], statement: string, format: 'tex' | 'raw' = 'tex') => {
  props.push({
    id: uuid(),
    statement,
    isRightAnswer: true,
    format: format,
  });
};
export const addWrongProp = (props: Proposition[], statement: string, format: 'tex' | 'raw' = 'tex') => {
  props.push({
    id: uuid(),
    statement,
    isRightAnswer: false,
    format: format,
  });
};
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
export interface Question<TQCMProps = any, TVEAProps = any> {
  instruction: string;
  startStatement?: string;
  answer: string;
  answerFormat: 'tex' | 'raw';
  keys?: KeyId[];
  commands?: string[];
  coords?: number[];
  options?: any;
  divisionFormat?: 'fraction' | 'obelus';
  qcmGeneratorProps?: TQCMProps;
  veaProps?: TVEAProps;
  //!! à virer apres refonte
  // getPropositions?: any;
}

export type QCMGenerator<T> = (n: number, args: T) => Proposition[];
export type VEA<T> = (studentAnswer: string, args: T) => boolean;
export type QuestionGenerator<TQCMProps = any, TVEAProps = any> = () => Question<TQCMProps, TVEAProps>;
export interface MathExercise<TQCMProps = any, TVEAProps = any> {
  id: string;
  isSingleStep: boolean;
  label: string;
  sections: MathSection[];
  levels: MathLevel[];
  connector?: '=' | '\\iff' | '\\approx';
  generator: (n: number) => Question<TQCMProps, TVEAProps>[];
  maxAllowedQuestions?: number;
  answerType?: 'QCM' | 'free';
  qcmTimer: number;
  freeTimer: number;
  getPropositions?: QCMGenerator<TQCMProps>;
  isAnswerValid?: VEA<TVEAProps>;
  //!! à virer apres refonte
  // instruction?: any;
  // keys?: any;
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
  | 'Combinatoire et dénombrement'
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
  | 'Valeur absolue'
  | 'Vecteurs';
