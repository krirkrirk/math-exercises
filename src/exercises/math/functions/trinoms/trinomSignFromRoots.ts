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
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeneralTrinomConstructor } from "#root/math/polynomials/generalTrinom";
import { IntervalConstructor } from "#root/math/sets/intervals/intervals";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { UnionIntervalNode } from "#root/tree/nodes/sets/unionIntervalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  trinomCoeffs: number[];
  isAskingPositive: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, trinomCoeffs, isAskingPositive },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const trinom = GeneralTrinomConstructor.fromCoeffs(trinomCoeffs);
  const roots = trinom.getRoots();
  const a = trinomCoeffs[2];
  const b = trinomCoeffs[1];
  tryToAddWrongProp(
    propositions,
    getAnswer({ trinomCoeffs, isAskingPositive: !isAskingPositive }),
  );
  tryToAddWrongProp(
    propositions,
    new IntervalNode(trinom.a, trinom.b, ClosureType.FF).toTex(),
  );
  while (propositions.length < n) {
    const interval = IntervalConstructor.random();
    tryToAddWrongProp(propositions, interval.toTree().toTex());
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {
  const trinom = GeneralTrinomConstructor.fromCoeffs(identifiers.trinomCoeffs);
  const roots = trinom.getRoots();
  const a = identifiers.trinomCoeffs[2];
  return a > 0 === identifiers.isAskingPositive
    ? new UnionIntervalNode([
        new IntervalNode(MinusInfinityNode, roots[0], ClosureType.OF),
        new IntervalNode(roots[1], PlusInfinityNode, ClosureType.FO),
      ])
    : new IntervalNode(roots[0], roots[1], ClosureType.FF);
};
const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return getAnswerNode(identifiers).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const trinom = GeneralTrinomConstructor.fromCoeffs(identifiers.trinomCoeffs);
  const roots = trinom.getRoots();
  return `Soit $f$ une fonction polynôme de degré $2$ définie sur $\\mathbb{R}$ par $f(x) = ${trinom.toTex()}$. 
  
Les racines de $f$ sont $x_1 = ${roots[0].toTex()}$ et $x_2=${roots[1].toTex()}$. 

Sur quel(s) intervalle(s) les valeurs de la fonction $f$ sont-elles ${
    identifiers.isAskingPositive ? "positives" : "négatives"
  } ?`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Une fonction polynôme de degré $2$ est du signe de son coefficient $a$, sauf entre ses racines.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const trinom = GeneralTrinomConstructor.fromCoeffs(identifiers.trinomCoeffs);
  const roots = trinom.getRoots();
  const a = identifiers.trinomCoeffs[2];
  const answer = getAnswer(identifiers);
  const ineqSign = a > 0 ? ">" : "<";
  const sign = a > 0 ? "positive" : "négative";
  return `On sait qu'une fonction polynôme de degré $2$ est du signe de son coefficient $a$, sauf entre ses racines.
  
Ici, $a = ${a}${ineqSign}0$.

$f$ est donc ${sign} sauf sur l'intervalle $${new IntervalNode(
    roots[0],
    roots[1],
    ClosureType.FF,
  ).toTex()}$.

On en déduit que $f$ est ${
    identifiers.isAskingPositive ? "positive" : "négative"
  } sur : 
  
$$
${answer}
$$`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["lbracket", "semicolon", "rbracket", "infty", "cup"];
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, isAskingPositive, trinomCoeffs },
) => {
  const ansNode = getAnswerNode({ isAskingPositive, trinomCoeffs });
  const texs = ansNode.toAllValidTexs();
  return texs.includes(ans);
};

const getTrinomSignFromRootsQuestion: QuestionGenerator<Identifiers> = () => {
  const trinom = GeneralTrinomConstructor.randomNiceRoots(2);
  const isAskingPositive = coinFlip();
  const identifiers: Identifiers = {
    isAskingPositive,
    trinomCoeffs: trinom.getCoeffs(),
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const trinomSignFromRoots: Exercise<Identifiers> = {
  id: "trinomSignFromRoots",
  connector: "\\iff",
  label: "Déterminer le signe d'un trinôme en connaissant ses racines",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getTrinomSignFromRootsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
