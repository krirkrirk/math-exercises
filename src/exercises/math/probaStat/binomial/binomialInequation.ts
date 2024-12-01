import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  tryToAddWrongProp,
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { numberVEA } from "#root/exercises/vea/numberVEA";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { Binomial } from "#root/math/probability/binomial";
import { IntervalConstructor } from "#root/math/sets/intervals/intervals";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import {
  IntervalNode,
  IntervalNodeIdentifiers,
} from "#root/tree/nodes/sets/intervalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";

//P(a<= P(x) <=b)
type Identifiers = {
  n: number;
  p: NodeIdentifiers;
  interval: IntervalNodeIdentifiers;
  type: number;
  isSentence: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(0, 1, 2).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const binomial = new Binomial(
    identifiers.n,
    NodeConstructor.fromIdentifiers(identifiers.p) as AlgebraicNode,
  );
  const a = (
    NodeConstructor.fromIdentifiers(
      identifiers.interval.leftChild,
    ) as AlgebraicNode
  ).evaluate();
  const b = (
    NodeConstructor.fromIdentifiers(
      identifiers.interval.rightChild,
    ) as AlgebraicNode
  ).evaluate();
  const isStrict = identifiers.interval.closure === ClosureType.OO;
  const ans =
    identifiers.type === 1
      ? binomial.inf(isStrict ? b - 1 : b)
      : identifiers.type === 2
      ? binomial.sup(isStrict ? a + 1 : a)
      : binomial.ineq(isStrict ? a + 1 : a, isStrict ? b - 1 : b);
  return round(ans, 2).frenchify();
};

const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  //au plus : X<=k
  //moins de : X<k
  //au moins: X >= k
  //pus de : X>k
  //entre : a <= X <= b (strict exclus)

  const pNode = NodeConstructor.fromIdentifiers(identifiers.p);
  const interval = NodeConstructor.fromIdentifiers(
    identifiers.interval,
  ) as IntervalNode;
  const isStrict = interval.closure === ClosureType.OO;
  let sentence = "";
  switch (identifiers.type) {
    case 1:
      sentence = isStrict
        ? `moins de $${interval.b.toTex()}$`
        : `au plus $${interval.b.toTex()}$`;
      break;
    case 2:
      sentence = isStrict
        ? `plus de $${interval.a.toTex()}$`
        : `au moins $${interval.a.toTex()}$`;
      break;
    case 3:
      sentence = `entre $${interval.a.toTex()}$ et $${interval.b.toTex()}$`;
  }
  return `Soit $X$ une variable aléatoire qui suit une loi binomiale de paramètres $n = ${
    identifiers.n
  }$ et $p = ${pNode.toTex()}$.
  
${
  identifiers.isSentence
    ? `Quelle est la probabilité d'obtenir ${sentence} succès ? Arrondir à $10^{-2}$ près.`
    : `Calculer en donnant la réponse à $10^{-2}$ près :
  
$$
P\\left(${interval.toInequality("X".toTree()).toTex()}\\right)
$$`
}`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberVEA(ans, answer);
};

const getBinomialInequationQuestion: QuestionGenerator<Identifiers, Options> = (
  opts,
) => {
  const n = random([randint(4, 10), 5 * randint(3, 10)]);
  const p = random([
    randfloat(0.01, 0.99, 2).toTree(),
    RationalConstructor.randomIrreductibleProba().toTree(),
  ]);

  const isSentence =
    !opts || opts?.instructionType === "Toutes"
      ? coinFlip()
      : opts.instructionType === "Uniquement sous forme de phrase";

  const type = randint(1, 4);
  let interval: IntervalNode | undefined;
  let isStrict = isSentence && type === 3 ? false : coinFlip();
  switch (type) {
    case 1:
      //P(X< <= b)
      interval = new IntervalNode(
        MinusInfinityNode,
        randint(isStrict ? 2 : 1, isStrict ? n + 1 : n).toTree(),
        isStrict ? ClosureType.OO : ClosureType.OF,
      );
      break;
    case 2:
      //P(X > >= a)
      interval = new IntervalNode(
        randint(isStrict ? 0 : 1, isStrict ? n - 1 : n).toTree(),
        PlusInfinityNode,
        isStrict ? ClosureType.OO : ClosureType.FO,
      );
      break;
    case 3:
    default:
      //P(a < X  <b)
      let a, b;
      do {
        a = randint(isStrict ? 0 : 1, isStrict ? n - 1 : n);
        b = randint(a + 1, isStrict ? n + 1 : n);
      } while (!b || Math.abs(b - a) < 2 || (isStrict && Math.abs(b - a) < 3));
      interval = new IntervalNode(
        a.toTree(),
        b.toTree(),
        isStrict ? ClosureType.OO : ClosureType.FF,
      );
      break;
  }
  const identifiers: Identifiers = {
    n,
    p: p.toIdentifiers(),
    interval: interval.toIdentifiers(),
    type,
    isSentence,
  };
  const question: Question<Identifiers, Options> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers, opts),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

type Options = {
  instructionType: string;
};
//>a, <a, [a,b], au plus a, au moins b, plus de, moins de,
const options: GeneratorOption[] = [
  {
    id: "instructionType",
    label: "Types de consignes",
    target: GeneratorOptionTarget.generation,
    type: GeneratorOptionType.select,
    values: [
      "Toutes",
      "Uniquement sous forme de phrase",
      "Uniquement sous forme mathématique",
    ],
    defaultValue: "Toutes",
  },
];
export const binomialInequation: Exercise<Identifiers, Options> = {
  id: "binomialInequation",
  connector: "\\iff",
  label:
    "Calculer une probabilité binomiale du type $P(X \\leq a)$, $P(X \\geq a)$ ou $P(a\\leq X\\leq b)$",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getBinomialInequationQuestion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  options,
};
