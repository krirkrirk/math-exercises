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
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import { GeneralTrinom } from "#root/math/polynomials/generalTrinom";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";
import { isFractionNode } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { square } from "#root/tree/nodes/operators/powerNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  aIdentifiers: NodeIdentifiers;
  bIdentifiers: NodeIdentifiers;
  cIdentifiers: NodeIdentifiers;
  isAsking: string;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, aIdentifiers, bIdentifiers, cIdentifiers, isAsking },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const trinom = new GeneralTrinom(
    NodeConstructor.fromIdentifiers(aIdentifiers) as AlgebraicNode,
    NodeConstructor.fromIdentifiers(bIdentifiers) as AlgebraicNode,
    NodeConstructor.fromIdentifiers(cIdentifiers) as AlgebraicNode,
  );
  if (answer === "1") {
    tryToAddWrongProp(propositions, "0");
  }
  if (answer === "0") {
    tryToAddWrongProp(propositions, "1");
  }
  if (answer === "-1") {
    tryToAddWrongProp(propositions, "-");
  }
  const askedNode =
    isAsking === "a" ? trinom.a : isAsking === "b" ? trinom.b : trinom.c;
  if (isFractionNode(askedNode)) {
    tryToAddWrongProp(propositions, askedNode.leftChild.toTex());
  }
  // si frac ajouter que le num
  const monom =
    isAsking === "a"
      ? multiply(trinom.a, square("x")).simplify()
      : isAsking === "b"
      ? multiply(trinom.b, "x").simplify()
      : trinom.c;
  tryToAddWrongProp(propositions, monom.toTex());
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10) + "");
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { aIdentifiers, bIdentifiers, cIdentifiers, isAsking } = identifiers;
  return isAsking === "a"
    ? NodeConstructor.fromIdentifiers(aIdentifiers).toTex()
    : isAsking === "b"
    ? NodeConstructor.fromIdentifiers(bIdentifiers).toTex()
    : NodeConstructor.fromIdentifiers(cIdentifiers).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const trinom = new GeneralTrinom(
    NodeConstructor.fromIdentifiers(identifiers.aIdentifiers) as AlgebraicNode,
    NodeConstructor.fromIdentifiers(identifiers.bIdentifiers) as AlgebraicNode,
    NodeConstructor.fromIdentifiers(identifiers.cIdentifiers) as AlgebraicNode,
  );

  return `Soit $f$ la fonction polynôme de degré $2$ définie sur $\\mathbb{R}$ par :
  
$$
f(x)=${trinom
    .toTree()
    .simplify({
      // forceDistributeFractions: true,
      forbidFactorize: true,
      towardsDistribute: true,
    })
    .toTex()}
$$
  
Quelle est la valeur du coefficient $${identifiers.isAsking}$ de $f$ ?`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const parsed = parseAlgebraic(ans);
  if (!parsed) return false;
  return parsed.simplify().toTex() === answer;
};

const getCoefficientsIdentificationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = random([
    (-1).toTree(),
    (1).toTree(),
    randint(-10, 11, [-1, 0, 1]).toTree(),
    RationalConstructor.randomIrreductible().toTree(),
  ]);

  const b = random([
    (-1).toTree(),
    (1).toTree(),
    (0).toTree(),
    randint(-10, 10, [-1, 1, 0]).toTree(),
    RationalConstructor.randomIrreductible().toTree(),
  ]);

  const c = random([
    (0).toTree(),
    randint(-10, 11, [0]).toTree(),
    RationalConstructor.randomIrreductible().toTree(),
  ]);

  const isAsking = random(["a", "b", "c"]);

  const identifiers: Identifiers = {
    aIdentifiers: a.toIdentifiers(),
    bIdentifiers: b.toIdentifiers(),
    cIdentifiers: c.toIdentifiers(),
    isAsking,
  };
  const question: Question<Identifiers> = {
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

export const coefficientsIdentification: Exercise<Identifiers> = {
  id: "coefficientsIdentification",
  connector: "=",
  label:
    "Reconnaître les coefficients $a$, $b$ et $c$ d'un trinôme exprimé sous forme développée",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getCoefficientsIdentificationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
};
