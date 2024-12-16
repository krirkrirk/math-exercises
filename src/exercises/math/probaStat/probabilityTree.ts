import { rationalVEA } from "#root/exercises/vea/rationalVEA";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Integer } from "#root/math/numbers/integer/integer";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { gcd } from "#root/math/utils/arithmetic/gcd";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";
import { add } from "#root/tree/nodes/operators/addNode";
import {
  FractionNode,
  FractionNodeIdentifiers,
  frac,
} from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { substract } from "#root/tree/nodes/operators/substractNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { random } from "#root/utils/alea/random";
import { shuffle } from "#root/utils/alea/shuffle";
import {
  Exercise,
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
  GetGGBOptions,
  GetInstruction,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  RebuildIdentifiers,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

const rebuildIdentifiers: RebuildIdentifiers<Identifiers, Options> = (
  oldIdentifiers,
) => {
  if (oldIdentifiers.probaName) return oldIdentifiers;
  const ABTotal = oldIdentifiers.A + oldIdentifiers.B;
  const ASubTotal = oldIdentifiers.AC + oldIdentifiers.AD;
  const BSubTotal = oldIdentifiers.BC + oldIdentifiers.BD;
  let probaName = "";
  switch (oldIdentifiers.type) {
    case 1:
      probaName = "P(A\\cap C)";
      break;
    case 2:
      probaName = "P(A\\cap D)";
      break;
    case 3:
      probaName = "P(B\\cap C)";
      break;
    case 4:
      probaName = "P(B\\cap D)";
      break;
  }
  return {
    probaName,
    A: frac(oldIdentifiers.A, ABTotal).simplify().toIdentifiers(),
    B: frac(oldIdentifiers.B, ABTotal).simplify().toIdentifiers(),
    AC: frac(oldIdentifiers.AC, ASubTotal).simplify().toIdentifiers(),
    AD: frac(oldIdentifiers.AD, ASubTotal).simplify().toIdentifiers(),
    BC: frac(oldIdentifiers.BC, BSubTotal).simplify().toIdentifiers(),
    BD: frac(oldIdentifiers.BD, BSubTotal).simplify().toIdentifiers(),
  };
};
type Identifiers = {
  // !!!handle old ides
  // type: number;
  //previously a, b, ac, ad, bc, bd (numbers)
  A: NodeIdentifiers;
  B: NodeIdentifiers;
  AC: NodeIdentifiers;
  AD: NodeIdentifiers;
  BC: NodeIdentifiers;
  BD: NodeIdentifiers;
  probaName: string;
};

const optionValues = [
  "Probabilité d'intersection $P(A\\cap C)$",
  "Probabilité totale $P(C)$",
  "Probabilité conditionnelle $P_B(A)$",
  "Probabilité 'simple' $P(A)$",
];
const defaultOptionValues = [
  "Probabilité d'intersection $P(A\\cap C)$",
  "Probabilité totale $P(C)$",
  "Probabilité conditionnelle $P_B(A)$",
];

const buildAll = (identifiers: Identifiers) => {
  return {
    pA: NodeConstructor.fromIdentifiers(identifiers.A) as AlgebraicNode,
    pAC: NodeConstructor.fromIdentifiers(identifiers.AC) as AlgebraicNode,
    pAD: NodeConstructor.fromIdentifiers(identifiers.AD) as AlgebraicNode,
    pB: NodeConstructor.fromIdentifiers(identifiers.B) as AlgebraicNode,
    pBC: NodeConstructor.fromIdentifiers(identifiers.BC) as AlgebraicNode,
    pBD: NodeConstructor.fromIdentifiers(identifiers.BD) as AlgebraicNode,
  };
};
const getAnswerNode = (identifiers: Identifiers) => {
  const probas = buildAll(identifiers);
  switch (identifiers.probaName) {
    case "P(A)":
      return probas.pA;
    case "P(B)":
      return probas.pB;
    case "P(A\\cap C)":
      return multiply(probas.pA, probas.pAC).simplify();
    case "P(A\\cap D)":
      return multiply(probas.pA, probas.pAD).simplify();
    case "P(B\\cap C)":
      return multiply(probas.pB, probas.pBC).simplify();
    case "P(B\\cap D)":
      return multiply(probas.pB, probas.pBD).simplify();
    case "P_A(C)":
      return probas.pAC;
    case "P_A(D)":
      return probas.pAD;
    case "P_B(C)":
      return probas.pBC;
    case "P_B(D)":
      return probas.pBD;
    case "P(C)":
      return add(
        multiply(probas.pA, probas.pAC),
        multiply(probas.pB, probas.pBC),
      ).simplify();
    case "P(D)":
    default:
      return add(
        multiply(probas.pA, probas.pAD),
        multiply(probas.pB, probas.pBD),
      ).simplify();
  }
};

const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  options,
) => {
  let instr = `On considère l'arbre de probabilités ci-dessous. Calculer : 
  
$$
${identifiers.probaName}
$$`;

  if (options?.allowApproximate) {
    instr += `

Donner la valeur exacte ou une valeur arrondie au ${options.allowApproximate}.`;
  }
  return instr;
};

const getProbaAndOpposite = (decimal = false) => {
  if (!decimal) {
    const proba = RationalConstructor.randomIrreductibleProba().toTree();
    return [proba, substract(1, proba).simplify()] as FractionNode[];
  } else {
    const proba = round(randfloat(0.01, 1, 2), 2);
    return [proba.toTree(), round(1 - proba, 2).toTree()];
  }
};

const getProbabilityTree: QuestionGenerator<Identifiers, Options> = (opts) => {
  const isDecimal = opts?.probaType === "Décimales";
  const [pA, pB] = getProbaAndOpposite(isDecimal);
  const [pC_A, pD_A] = getProbaAndOpposite(isDecimal);
  const [pC_B, pD_B] = getProbaAndOpposite(isDecimal);
  const eventTypes = opts?.eventTypes?.length
    ? opts.eventTypes
    : defaultOptionValues;
  const type = random(eventTypes);
  const index = optionValues.indexOf(type);
  let probaName = "";
  switch (index) {
    case 0: //inter
      probaName = random([
        "P(A\\cap C)",
        "P(A\\cap D)",
        "P(B\\cap C)",
        "P(B\\cap D)",
      ]);
      break;
    case 1: //totale
      probaName = random(["P(C)", "P(D)"]);
      break;

    case 2: //conditionnal
      probaName = random(["P_A(C)", "P_A(D)", "P_B(C)", "P_B(D)"]);
      break;

    case 3: //simple
      probaName = random(["P(A)", "P(B)"]);
      break;
  }
  const identifiers: Identifiers = {
    A: pA.toIdentifiers(),
    B: pB.toIdentifiers(),
    AC: pC_A.toIdentifiers(),
    AD: pD_A.toIdentifiers(),
    BC: pC_B.toIdentifiers(),
    BD: pD_B.toIdentifiers(),
    probaName,
  };

  const question: Question<Identifiers, Options> = {
    instruction: getInstruction(identifiers, opts),
    startStatement: probaName,
    answer: getAnswerNode(identifiers).toTex(),
    keys: [],
    ggbOptions: getGGBOptions(identifiers, opts),
    answerFormat: "tex",
    identifiers,
  };

  return question;
};

const getGGBOptions: GetGGBOptions<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const probas = buildAll(identifiers);
  let commands = [
    "A = Point({2,2})",
    "B = Point({2,-2})",
    "AC = Point({5,3})",
    "AD = Point({5,1})",
    "BC = Point({5,-1})",
    "BD = Point({5,-3})",
    "Segment(Point({0,0}),A)",
    "Segment(A,AC)",
    "Segment(A,AD)",
    "Segment(Point({0,0}),B)",
    "Segment(B,BC)",
    "Segment(B,BD)",
    `Text("\\scriptsize ${probas.pA.toTex()}", (0.1, 2.2), true, true)`,
    `Text("\\scriptsize ${probas.pAC.toTex()}", (2.8, 4), true, true)`,
    `Text("\\scriptsize ${probas.pAD.toTex()}", (2.8, 1.6), true, true)`,
    `Text("\\scriptsize ${probas.pB.toTex()}", (0.1, -0.8), true, true)`,
    `Text("\\scriptsize ${probas.pBC.toTex()}", (2.8, -0.6), true, true)`,
    `Text("\\scriptsize ${probas.pBD.toTex()}", (2.8, -2.5), true, true)`,
    'Text("A", (1.85 , 2.5))',
    'Text("B", (1.85 , -2.8))',
    'Text("C", (5.5 , 2.85))',
    'Text("D", (5.5 , 0.85))',
    'Text("C", (5.5 , -1.1))',
    'Text("D", (5.5 , -3.1))',
  ];

  const ggb = new GeogebraConstructor({
    commands,
    hideAxes: true,
    hideGrid: true,
  });
  return ggb.getOptions({
    coords: [-2, 8, -5, 5],
  });
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, ...identifiers },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const answerNode = getAnswerNode(identifiers);
  while (propositions.length < n) {
    const wrongAnswer = multiply(answerNode, randint(2, 11)).simplify();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

type Options = {
  allowApproximate: string;
  eventTypes: string[];
  probaType: string;
};
const isAnswerValid: VEA<Identifiers, Options> = (
  ans,
  { answer, ...identifiers },
  opts,
) => {
  try {
    const rank = opts?.allowApproximate
      ? ["dixième", "centième", "millième"].indexOf(opts.allowApproximate) + 1
      : undefined;
    return rationalVEA(ans, answer, {
      allowNonIrreductible: true,
      allowDecimal: true,
      decimalPrecision: rank,
    });
  } catch (err) {
    return false;
  }
};

const options: GeneratorOption[] = [
  {
    id: "allowApproximate",
    label: "Autoriser les valeurs approchées au : ",
    target: GeneratorOptionTarget.vea,
    type: GeneratorOptionType.select,
    defaultValue: "centième",
    values: ["dixième", "centième", "millième"],
  },
  {
    id: "eventTypes",
    label: "Types de questions",
    target: GeneratorOptionTarget.generation,
    type: GeneratorOptionType.multiselect,
    defaultValue: defaultOptionValues,
    values: optionValues,
  },
  {
    id: "probaType",
    label: "Format des probabilités",
    target: GeneratorOptionTarget.generation,
    type: GeneratorOptionType.select,
    defaultValue: "Fractions",
    values: ["Fractions", "Décimales"],
  },
];

export const probabilityTree: Exercise<Identifiers, Options> = {
  id: "probabilityTree",
  connector: "=",
  label: "Calculs de probabilités à l'aide d'un arbre pondéré",
  isSingleStep: false,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getProbabilityTree(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
  options,
  rebuildIdentifiers,
};
