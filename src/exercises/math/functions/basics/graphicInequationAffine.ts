import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import {
  InegalitySymbols,
  InequationSymbol,
  InequationSymbolConstructor,
} from "#root/math/inequations/inequation";
import { Affine } from "#root/math/polynomials/affine";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { Closure, ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  yValue: number;
  xValue: number;
  inegalitySymbol: InegalitySymbols;
  a: number;
  b: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const isTowardsLeft = coinFlip();
    const k = randint(-10, 10).toTree();
    const bounds = isTowardsLeft
      ? [MinusInfinityNode, k]
      : [k, PlusInfinityNode];
    const closure = Closure.fromBrackets(
      isTowardsLeft ? "]" : "[",
      random(["]", "["]),
    );

    tryToAddWrongProp(
      propositions,
      new IntervalNode(bounds[0], bounds[1], closure).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  //ax+b ! y
  const { a, inegalitySymbol, xValue } = identifiers;
  const inequation = new InequationSymbol(inegalitySymbol);
  const isStrict = inequation.isStrict;
  const isAskingSup = inequation.isSup;
  const isCroissante = a > 0;

  const inter = new IntervalNode(
    isCroissante === isAskingSup ? xValue.toTree() : MinusInfinityNode,
    isCroissante === isAskingSup ? PlusInfinityNode : xValue.toTree(),
    isStrict
      ? ClosureType.OO
      : isCroissante === isAskingSup
      ? ClosureType.FO
      : ClosureType.OF,
  );
  return inter.toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { yValue, inegalitySymbol, a, b } = identifiers;
  const inequation = new InequationSymbol(inegalitySymbol);
  const isStrict = inequation.isStrict;
  const isAskingSup = inequation.isSup;
  return `Ci-dessous est tracé la courbe représentative d'une fonction $f$. Déterminer graphiquement les solutions de l'inéquation $f(x)${
    isAskingSup ? (isStrict ? ">" : "\\geq") : isStrict ? "<" : "\\leq"
  }${yValue}$`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getGGBOptions: GetGGBOptions<Identifiers> = (identifiers) => {
  const { a, b } = identifiers;
  const affine = new Affine(a, b);
  const ggb = new GeogebraConstructor({
    commands: affine.toGGBCommands(),
  });
  return ggb.getOptions({
    coords: [-10, 10, -10, 10],
  });
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [
    "S",
    "equal",
    "lbracket",
    "semicolon",
    "rbracket",
    "infty",
    "cup",
    "lbrace",
    "rbrace",
    "varnothing",
  ];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const inter = answer;
  return ans === inter || ans === "S=" + inter;
  throw Error("VEA not implemented");
};

const getGraphicInequationAffineQuestion: QuestionGenerator<Identifiers> = (
  opts,
) => {
  const yValue = randint(-5, 6);
  const xValue = randint(-5, 6);
  const a = randfloat(-3, 4, 1, [0]);
  const b = yValue - a * xValue;
  const inegalitySymbol = InequationSymbolConstructor.randomSymbol();
  const identifiers: Identifiers = {
    a,
    b,
    xValue,
    yValue,
    inegalitySymbol,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
    ggbOptions: getGGBOptions(identifiers),
  };

  return question;
};

export const graphicInequationAffine: Exercise<Identifiers> = {
  id: "graphicInequationAffine",
  connector: "=",
  label: "Résoudre graphiquement une inéquation (fonctions affines)",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getGraphicInequationAffineQuestion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getInstruction,
  getAnswer,
  getGGBOptions,
  hasGeogebra: true,
};
