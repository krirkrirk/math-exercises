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
import { rationalVEA } from "#root/exercises/vea/rationalVEA";
import {
  GeneralTrinom,
  GeneralTrinomConstructor,
  GeneralTrinomIdentifiers,
} from "#root/math/polynomials/generalTrinom";
import { randint } from "#root/math/utils/random/randint";
import { opposite } from "#root/tree/nodes/functions/oppositeNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";

type Identifiers = {
  trinomIdentifiers: GeneralTrinomIdentifiers;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, trinomIdentifiers },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const trinom = GeneralTrinomConstructor.fromIdentifiers(trinomIdentifiers);
  tryToAddWrongProp(propositions, frac(trinom.b, trinom.a).simplify().toTex());
  tryToAddWrongProp(propositions, frac(trinom.c, trinom.a).simplify().toTex());
  tryToAddWrongProp(
    propositions,
    frac(opposite(trinom.b), multiply(2, trinom.a)).simplify().toTex(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { trinomIdentifiers } = identifiers;
  const trinom = GeneralTrinomConstructor.fromIdentifiers(trinomIdentifiers);
  const ans = frac(opposite(trinom.b), trinom.a).simplify().toTex();
  return ans;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { trinomIdentifiers } = identifiers;
  const trinom = GeneralTrinomConstructor.fromIdentifiers(trinomIdentifiers);
  return `Soit $f$ la fonction définie sur $\\mathbb{R}$ par :
  
$$
f(x) = ${trinom.toTree().toTex()}
$$

On admet que $f$ possède deux racines. 
  
Que vaut la somme des racines de $f$ ?`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Si $f(x) = ax^2 + bx + c$ admet deux racines, alors leur somme vaut : 
  
$$
S = -\\frac{b}{a}
$$`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const { trinomIdentifiers } = identifiers;
  const trinom = GeneralTrinomConstructor.fromIdentifiers(trinomIdentifiers);
  const aTex = trinom.a.toTex();
  const bTex = trinom.b.toTex();
  const ans = frac(opposite(trinom.b), trinom.a);

  return `Si $f(x) = ax^2 + bx + c$ admet deux racines, alors leur somme $S$ vaut : 
  
$$
S = \\frac{c}{a}
$$

Ici, on a $a = ${aTex}$ et $b = ${bTex}$, donc :

$$
S = ${ans.toSimplificationString()}
$$
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return rationalVEA(ans, answer);
};

const getRootsSumQuestion: QuestionGenerator<Identifiers> = (ops) => {
  //(b,c) != 0
  //ac <= 0
  const a = randint(-10, 10, [0]);
  const b = randint(-10, 10);
  const c = (a / Math.abs(a)) * randint(-10, 10, !b ? [0] : []);
  // const trinom = GeneralTrinomConstructor.randomNiceRoots(2);
  const trinom = new GeneralTrinom(a, b, c);
  const identifiers: Identifiers = {
    trinomIdentifiers: trinom.toIdentifiers(),
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

export const rootsSum: Exercise<Identifiers> = {
  id: "rootsSum",
  connector: "=",
  label: "Somme des racines d'un trinôme",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getRootsSumQuestion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
