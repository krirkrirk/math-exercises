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
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import {
  GeneralTrinom,
  GeneralTrinomConstructor,
  GeneralTrinomIdentifiers,
} from "#root/math/polynomials/generalTrinom";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { opposite } from "#root/tree/nodes/functions/oppositeNode";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";
import { add } from "#root/tree/nodes/operators/addNode";
import { frac } from "#root/tree/nodes/operators/fractionNode";
import { multiply } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { doWhile } from "#root/utils/doWhile";

type Identifiers = {
  trinomIdentifiers: GeneralTrinomIdentifiers;
  firstRootIdentifiers: NodeIdentifiers;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-10, 10).frenchify());
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const { trinomIdentifiers, firstRootIdentifiers } = identifiers;
  const trinom = GeneralTrinomConstructor.fromIdentifiers(trinomIdentifiers);
  const firstRoot = NodeConstructor.fromIdentifiers(
    firstRootIdentifiers,
  ) as AlgebraicNode;
  const firstRootTex = firstRoot.toTex();
  const roots = trinom.getRoots().map((e) => e.toTex());
  return roots.find((r) => r !== firstRootTex)!;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const { trinomIdentifiers, firstRootIdentifiers } = identifiers;
  const trinom = GeneralTrinomConstructor.fromIdentifiers(trinomIdentifiers);
  const firstRoot = NodeConstructor.fromIdentifiers(
    firstRootIdentifiers,
  ) as AlgebraicNode;
  const firstRootTex = firstRoot.toTex();
  return `Soit $f$ la fonction polynôme du second degré définie sur $\\mathbb{R}$ par :
  
$$
f(x) = ${trinom.toTree().toTex()}
$$
  
On admet que $f$ admet deux racines, dont une vaut $${firstRootTex}$. 
  
Sans calculer $\\Delta$, déterminer la deuxième racine de $f$.`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Si $f(x) = ax^2 + bx + c$ admet deux racines $x_1$ et $x_2$, alors leur produit vaut : 
    
$$
x_1\\times x_2 = \\frac{c}{a}
$$

En remplaçant les valeurs par celles données dans l'énoncé, on peut déterminer la deuxième racine de $f$. 
`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const { trinomIdentifiers, firstRootIdentifiers } = identifiers;
  const trinom = GeneralTrinomConstructor.fromIdentifiers(trinomIdentifiers);
  const firstRoot = NodeConstructor.fromIdentifiers(
    firstRootIdentifiers,
  ) as AlgebraicNode;

  const cOverA = frac(trinom.c, trinom.a).simplify();
  return `On sait que le produit des racines $x_1$ et $x_2$ de $f$ vaut :
  
$$
x_1\\times x_2 = \\frac{c}{a} = ${cOverA.toTex()}
$$

Or on sait que $x_1 = ${firstRoot.toTex()}$. On a donc : 

$$
x_2 = ${frac(cOverA, firstRoot).toSimplificationString()}
$$
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return rationalVEA(ans, answer);
};

const getFindSecondRootQuestion: QuestionGenerator<Identifiers> = (ops) => {
  // const firstRoot = coinFlip()
  //   ? randint(-10, 10).toTree()
  //   : RationalConstructor.randomIrreductibleWithSign(5).toTree();
  const firstRoot = randint(-10, 10);
  // const secondRoot = doWhile(
  //   () =>
  //     coinFlip()
  //       ? randint(-10, 10).toTree()
  //       : RationalConstructor.randomIrreductibleWithSign(5).toTree(),
  //   (x) => x.equals(firstRoot),
  // );
  const secondRoot = randint(-10, 10, [firstRoot]);
  const a = randint(-10, 10, [0]);
  const b = opposite(multiply(a, add(firstRoot, secondRoot))).simplify();
  const c = multiply(a, multiply(firstRoot, secondRoot)).simplify();
  //first*second = c/a
  const identifiers: Identifiers = {
    firstRootIdentifiers: firstRoot.toTree().toIdentifiers(),
    trinomIdentifiers: new GeneralTrinom(a, b, c).toIdentifiers(),
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

export const findSecondRoot: Exercise<Identifiers> = {
  id: "findSecondRoot",
  connector: "=",
  label: "Déterminer la deuxième racine d'un trinôme sans utiliser $\\Delta$",
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getFindSecondRootQuestion(opts), nb),
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
