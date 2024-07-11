import { KeyId } from "#root/types/keyIds";
import { shuffle } from "#root/utils/shuffle";
import { uuid } from "uuidv4";

export const addValidProp = (
  props: Proposition[],
  statement: string,
  format: "tex" | "raw" = "tex",
) => {
  props.push({
    id: uuid(),
    statement,
    isRightAnswer: true,
    format: format,
  });
};
export const addWrongProp = (
  props: Proposition[],
  statement: string,
  format: "tex" | "raw" = "tex",
) => {
  props.push({
    id: uuid(),
    statement,
    isRightAnswer: false,
    format: format,
  });
};
export const tryToAddWrongProp = (
  props: Proposition[],
  statement: string,
  format: "tex" | "raw" = "tex",
) => {
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
  format: "tex" | "raw";
};
export interface Question<TIdentifiers = {}> {
  instruction: string;
  hint?: string;
  correction?: string;
  startStatement?: string;
  answer: string;
  answerFormat: "tex" | "raw";
  keys?: KeyId[];
  commands?: string[];
  coords?: number[];
  options?: {
    gridDistance?: [number, number] | false;
    hideGrid?: boolean;
    hideAxes?: boolean;
    isGridBold?: boolean;
    isGridSimple?: boolean;
    isAxesRatioFixed?: boolean;
    isXAxesNatural?: boolean;
    is3D?: boolean;
  };
  style?: {
    tableHasNoHeader?: boolean;
  };
  divisionFormat?: "fraction" | "obelus";
  identifiers: TIdentifiers;
}

export type QCMGenerator<TIdentifiers> = (
  n: number,
  args: { answer: string } & TIdentifiers,
) => Proposition[];
export type VEA<TIdentifiers> = (
  studentAnswer: string,
  args: { answer: string } & TIdentifiers,
) => boolean;
export type QuestionGenerator<TIdentifiers = {}, TOptions = {}> = (
  opts?: TOptions,
) => Question<TIdentifiers>;
export interface Exercise<TIdentifiers = {}> {
  id: string;
  isSingleStep: boolean;
  label: string;
  sections: (MathSection | PCSection)[];
  levels: MathLevel[];
  connector?: "=" | "\\iff" | "\\approx";
  generator: (n: number) => Question<TIdentifiers>[];
  maxAllowedQuestions?: number;
  answerType?: "QCM" | "free" | "QCU";
  qcmTimer: number;
  freeTimer: number;
  getPropositions?: QCMGenerator<{ answer: string } & TIdentifiers>;
  isAnswerValid?: VEA<TIdentifiers>;
  hasGeogebra?: boolean;
  subject: "Mathématiques" | "Chimie" | "Physique";
}

export type MathLevel =
  | "6ème"
  | "5ème"
  | "4ème"
  | "3ème"
  | "2nde"
  | "1reTech"
  | "1reESM"
  | "1reSpé"
  | "TermSpé"
  | "TermTech"
  | "MathExp"
  | "MathComp"
  | "CAP"
  | "2ndPro"
  | "1rePro"
  | "TermPro";

export type MathSection =
  | "Aires"
  | "Arithmétique"
  | "Calcul littéral"
  | "Calculs"
  | "Combinatoire et dénombrement"
  | "Conversions"
  | "Dérivation"
  | "Droites"
  | "Ensembles et intervalles"
  | "Équations"
  | "Équations différentielles"
  | "Exponentielle"
  | "Fonction cube"
  | "Fonction inverse"
  | "Fonctions"
  | "Fonctions affines"
  | "Fonctions de référence"
  | "Fractions"
  | "Géométrie cartésienne"
  | "Géométrie euclidienne"
  | "Inéquations"
  | "Intégration"
  | "Limites"
  | "Logarithme népérien"
  | "Logarithme décimal"
  | "Matrices"
  | "Nombres complexes"
  | "Périmètres"
  | "Pourcentages"
  | "Primitives"
  | "Probabilités"
  | "Produit scalaire"
  | "Proportionnalité"
  | "Python"
  | "Puissances"
  | "Python"
  | "Racines carrées"
  | "Second degré"
  | "Statistiques"
  | "Suites"
  | "Systèmes"
  | "Théorème de Pythagore"
  | "Théorème de Thalès"
  | "Trigonométrie"
  | "Valeur absolue"
  | "Vecteurs";

export type PCSection =
  | "Réaction chimique"
  | "Chimie des solutions"
  | "Forces"
  | "Chimie organique"
  | "Mécanique"
  | "Lumière"
  | "Acide / Base"
  | "Constitution et transformations de la matière"
  | "Ondes"
  | "Son"
  | "Corps purs et mélanges"
  | "Fluides"
  | "Mol"
  | "Électricité"
  | "Spectrophotométrie"
  | "Quantique";
