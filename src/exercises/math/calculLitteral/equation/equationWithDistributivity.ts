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
  GeneratorOption,
  GeneratorOptionType,
  GeneratorOptionTarget,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { dividersOf } from "#root/math/utils/arithmetic/dividersOf";
import { randint } from "#root/math/utils/random/randint";
import { isAlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { equal } from "#root/tree/nodes/equations/equalNode";
import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
import { add } from "#root/tree/nodes/operators/addNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { substract } from "#root/tree/nodes/operators/substractNode";
import { equationSolutionParser } from "#root/tree/parsers/equationSolutionParser";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";

//a(bx+c) = dx + e ou a(bx+c) = d(ex+f)
type Identifiers = {
  type: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
};

const getPropositions: QCMGenerator<Identifiers, Options> = (
  n,
  { answer },
  opts,
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    if (opts?.integerSolutions) {
      tryToAddWrongProp(propositions, `x=${randint(-10, 11).toTree().toTex()}`);
    } else {
      tryToAddWrongProp(
        propositions,
        `x=${frac(randint(-50, 50), randint(-50, 50, [0]))
          .simplify()
          .toTex()}`,
      );
    }
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { type, a, b, c, d, e, f } = identifiers;
  const sol = type
    ? frac(
        substract(multiply(d, f), multiply(a, c)),
        substract(multiply(a, b), multiply(d, e)),
      )
        .simplify()
        .toTex()
    : frac(substract(e, multiply(a, c)), substract(multiply(a, b), d))
        .simplify()
        .toTex();
  return `x=${sol}`;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { type, a, b, c, d, e, f } = identifiers;
  const left = multiply(a, add(multiply(b, "x"), c));
  const right = type
    ? multiply(d, add(multiply(e, "x"), f))
    : add(multiply(d, "x"), e);
  const equalNode = equal(left, right);
  return `Résoudre l'équation suivante : 
  
$$
${equalNode.toTex()}
$$`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {
//   return ``;
// };
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
//   return ``;
// };

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["x", "equal"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const parsed = equationSolutionParser(ans);
  if (!parsed) return false;
  return `x=${parsed.toTex()}` === answer;
};

//type 0 : a(bx+c) = dx + e ou type 1 : a(bx+c) = d(ex+f)

type Options = {
  integerSolutions: boolean;
};
const getEquationWithDistributivityQuestion: QuestionGenerator<
  Identifiers,
  Options
> = (opts) => {
  const type = random([0, 1]);

  const a = randint(-9, 10, [0, 1]);
  const b = randint(-9, 10, [0]);
  const c = randint(-9, 10, [0]);

  const x = opts?.integerSolutions ? randint(-10, 11) : undefined;
  const y = opts?.integerSolutions ? a * (b * x! + c) : undefined;

  const d =
    opts?.integerSolutions && type === 1 && y !== 0
      ? random(dividersOf(Math.abs(y!)))
      : randint(-9, 10, type ? [0] : [0, a * b]);

  const e =
    opts?.integerSolutions && type === 0
      ? y! - d * x!
      : randint(-9, 10, type ? [0, (a * b) / d] : []);

  const f =
    opts?.integerSolutions && type === 1
      ? (y! - d * e * x!) / d
      : randint(-9, 10);
  const identifiers: Identifiers = {
    type,
    a,
    b,
    c,
    d,
    e,
    f,
  };
  const question: Question<Identifiers, Options> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    // hint: getHint(identifiers),
    // correction: getCorrection(identifiers),
  };

  return question;
};

const options: GeneratorOption[] = [
  {
    id: "integerSolutions",
    label: "Solutions entières",
    type: GeneratorOptionType.checkbox,
    target: GeneratorOptionTarget.generation,
  },
];
export const equationWithDistributivity: Exercise<Identifiers, Options> = {
  id: "equationWithDistributivity",
  connector: "\\iff",
  label: "Résoudre une équation du premier degré après développement",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getEquationWithDistributivityQuestion(opts), nb),
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
