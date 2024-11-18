import { KeyId } from "#root/types/keyIds";
import { KeyProps } from "#root/types/keyProps";
import { shuffle } from "#root/utils/alea/shuffle";
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

export enum GeneratorOptionTarget {
  generation,
  vea,
  ggb,
  instruction,
  hint,
  correction,
  answer,
  qcm,
  keys,
}
export type GeneratorOption = {
  id: string;
  label: string;
  type: "checkbox" | "select";
  target: GeneratorOptionTarget;
};

export type Proposition = {
  id: string;
  statement: string;
  isRightAnswer: boolean;
  format: "tex" | "raw";
};

export type GeogebraAxisOptions = {
  steps?: number;
  hidden?: boolean;
  hideNumbers?: boolean;
  label?: string;
  natural?: boolean;
  showPositive?: boolean;
};

export type GeogebraOptions = {
  customToolBar?: string;
  forbidShiftDragZoom?: boolean;
  commands?: string[];
  coords: number[];
  is3D?: boolean;
  gridDistance?: [number, number] | false;
  hideGrid?: boolean;
  hideAxes?: boolean;
  isGridBold?: boolean;
  isGridSimple?: boolean;
  lockedAxesRatio?: number | false;
  xAxis?: GeogebraAxisOptions;
  yAxis?: GeogebraAxisOptions;
};

export type KeyboardOptions = {
  parenthesisShouldNotProduceLeftRight?: boolean;
};

export interface Question<TIdentifiers = {}, TOptions = {}> {
  instruction: string;
  hint?: string;
  correction?: string;
  startStatement?: string;
  answer?: string;
  answerFormat?: "tex" | "raw";
  ggbAnswer?: string[];
  keyboardOptions?: KeyboardOptions;
  keys?: (KeyId | KeyProps)[];
  // keys?: KeyId[];
  ggbOptions?: GeogebraOptions;
  studentGgbOptions?: GeogebraOptions;
  style?: {
    tableHasNoHeader?: boolean;
  };
  divisionFormat?: "fraction" | "obelus";
  identifiers: TIdentifiers;
  options?: TOptions;
}

export type QCMGenerator<TIdentifiers, TOptions = {}> = (
  n: number,
  args: { answer: string } & TIdentifiers,
  options?: TOptions,
) => Proposition[];
export type VEA<TIdentifiers, TOptions = {}> = (
  studentAnswer: string,
  args: { answer: string } & TIdentifiers,
  options?: TOptions,
) => boolean;
export type GGBVEA<TIdentifiers, TOptions = {}> = (
  studentAnswer: string[],
  args: { ggbAnswer: string[] } & TIdentifiers,
  options?: TOptions,
) => boolean;
export type QuestionGenerator<TIdentifiers = {}, TOptions = any> = (
  opts?: TOptions,
) => Question<TIdentifiers, TOptions>;
export type GetHint<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => string;
export type GetCorrection<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => string;
export type GetInstruction<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => string;
export type GetAnswer<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => string;
export type GetKeys<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => (KeyId | KeyProps)[];
export type GetGGBAnswer<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => string[];
export type GetGGBOptions<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => GeogebraOptions;
export type GetStudentGGBOptions<TIdentifiers, TOptions = {}> = (
  args: TIdentifiers,
  options?: TOptions,
) => GeogebraOptions;
export type RebuildIdentifiers<TIdentifiers, TOptions = {}> = (
  oldIdentifiers: any,
  options?: TOptions,
) => TIdentifiers;
export type GetQuestionFromIdentifiers<TIdentifiers, TOptions = {}> = (
  identifiers: TIdentifiers,
  options?: TOptions,
) => Question<TIdentifiers>;
export type QuestionHotFix<TIdentifiers, TOptions = {}> = (
  q: Question<TIdentifiers>,
  options?: TOptions,
) => Question<TIdentifiers>;

type PDFOptions = {
  //on pourrait mettre ici des props pour geogebra
  shouldSpreadPropositions?: boolean;
};
export interface Exercise<TIdentifiers = {}, TOptions = {}> {
  id: string;
  isSingleStep: boolean;
  label: string;
  pdfOptions?: PDFOptions;
  options?: GeneratorOption[];
  sections?: (MathSection | PCSection)[];
  levels?: MathLevel[];
  connector?: "=" | "\\iff" | "\\approx";
  generator: (n: number, opts?: TOptions) => Question<TIdentifiers, TOptions>[];
  maxAllowedQuestions?: number;
  answerType?: "GGB" | "QCM" | "free" | "QCU";
  isQCM?: boolean;
  qcmTimer?: number;
  freeTimer?: number;
  ggbTimer?: number;
  getPropositions?: QCMGenerator<{ answer: string } & TIdentifiers, TOptions>;
  isAnswerValid?: VEA<TIdentifiers, TOptions>;
  isGGBAnswerValid?: GGBVEA<TIdentifiers, TOptions>;
  hasGeogebra?: boolean;
  subject: "Mathématiques" | "Chimie" | "Physique";
  hasHintAndCorrection?: boolean;
  getInstruction?: GetInstruction<TIdentifiers, TOptions>;
  getHint?: GetHint<TIdentifiers, TOptions>;
  getCorrection?: GetCorrection<TIdentifiers, TOptions>;
  getKeys?: GetKeys<TIdentifiers, TOptions>;
  getAnswer?: GetAnswer<TIdentifiers, TOptions>;
  getGGBAnswer?: GetGGBAnswer<TIdentifiers, TOptions>;
  getGGBOptions?: GetGGBOptions<TIdentifiers, TOptions>;
  getStudentGGBOptions?: GetStudentGGBOptions<TIdentifiers, TOptions>;
  rebuildIdentifiers?: RebuildIdentifiers<TIdentifiers, TOptions>;
  getQuestionFromIdentifiers?: GetQuestionFromIdentifiers<
    TIdentifiers,
    TOptions
  >;
  hotFix?: QuestionHotFix<TIdentifiers, TOptions>;
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
  | "Mécanique gravitationnelle"
  | "Spectrophotométrie"
  | "Quantique"
  | "Thermodynamique"
  | "Énergie";
