import {
  Exercise,
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  RebuildIdentifiers,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { Integer } from "#root/math/numbers/integer/integer";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { EqualNode, equal } from "#root/tree/nodes/equations/equalNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/alea/shuffle";
import { v4 } from "uuid";
import { alignTex } from "#root/utils/latex/alignTex";
import { FractionNode, frac } from "#root/tree/nodes/operators/fractionNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { GeneralAffine } from "#root/math/polynomials/generalAffine";
import {
  NodeConstructor,
  NodeIdentifiers,
} from "#root/tree/nodes/nodeConstructor";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { substract } from "#root/tree/nodes/operators/substractNode";
import { add } from "#root/tree/nodes/operators/addNode";

/**
 *  type ax=b
 */

//!old Ids have a,b = number
type Identifiers = {
  a: NodeIdentifiers;
  b: NodeIdentifiers;
  isXRight: boolean;
  aNumberType: string;
};

const rebuildIdentifiers: RebuildIdentifiers<Identifiers> = (
  oldIdentifiers,
) => {
  if (!!oldIdentifiers.numberType) return oldIdentifiers;
  return {
    a: (oldIdentifiers.a as number).toTree().toIdentifiers(),
    b: (oldIdentifiers.b as number).toTree().toIdentifiers(),
    isXRight: false,
    aNumberType: "Entier",
  };
};

const getEquationType2ExerciseQuestion: QuestionGenerator<
  Identifiers,
  Options
> = (opts) => {
  const types = opts?.aNumberType ?? ["Entier"];
  const b = randint(-10, 11).toTree();
  const type = random(types);

  const a =
    type === "Entier"
      ? randint(-9, 10, [0, 1]).toTree()
      : RationalConstructor.randomIrreductibleWithSign().toTree();

  const solution = frac(b, a).simplify();
  const affine = new GeneralAffine(a, 0).toTree();

  const isXRight = coinFlip();
  const equalTree = new EqualNode(affine, b);
  const tree = isXRight ? equalTree.reverse() : equalTree;

  const answer = new EqualNode(new VariableNode("x"), solution).toTex();

  const statementTex = tree.toTex();
  const identifiers = {
    a: a.toIdentifiers(),
    b: b.toIdentifiers(),
    isXRight,
    aNumberType: type,
  };

  const question: Question<Identifiers, Options> = {
    instruction: `Résoudre : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: equationKeys,
    answerFormat: "tex",
    identifiers: identifiers,
    hint: `Il faut isoler $x$ à ${
      isXRight ? "droite" : "gauche"
    }. Pour cela, effectue l'opération des deux côtés de l'équation qui permet de supprimer la multiplication par $${a.toTex()}$.`,
    correction: `Pour isoler $x$ à ${
      isXRight ? "droite" : "gauche"
    }, on divise les deux côtés de l'équation par $${a.toTex()}$ : 
    
${alignTex([
  [
    `${statementTex}`,
    "\\iff",
    isXRight
      ? equal(frac(b, a), frac(affine, a)).toTex()
      : equal(frac(affine, a), frac(b, a)).toTex(),
  ],
  ["", "\\iff", answer],
])}
    `,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers, Options> = (
  n,
  { answer, a, b },
) => {
  const aNode = NodeConstructor.fromIdentifiers(a) as AlgebraicNode;
  const bNode = NodeConstructor.fromIdentifiers(b) as AlgebraicNode;

  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, substract(bNode, aNode).simplify().toTex());

  while (propositions.length < n) {
    const bEv = randint(-7, 8, [0, -bNode.evaluate()]);
    const a = add(aNode, randint(-7, 8, [-aNode.evaluate(), 0]));
    const wrongAnswer = frac(bEv, a).simplify();
    tryToAddWrongProp(
      propositions,
      new EqualNode(new VariableNode("x"), wrongAnswer).toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const aNode = NodeConstructor.fromIdentifiers(a) as AlgebraicNode;
  const bNode = NodeConstructor.fromIdentifiers(b) as AlgebraicNode;

  const solution = frac(bNode, aNode).simplify();
  const answerTree = new EquationSolutionNode(new DiscreteSetNode([solution]), {
    opts: { allowFractionToDecimal: true, allowRawRightChildAsSolution: true },
  });

  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

type Options = {
  aNumberType: string[];
};

const options: GeneratorOption[] = [
  {
    id: "aNumberType",
    label: "Autoriser des fractions pour $a$",
    target: GeneratorOptionTarget.generation,
    type: GeneratorOptionType.multiselect,
    defaultValue: ["Entier"],
    values: ["Entier", "Rationnel"],
  },
];

export const equationType2Exercise: Exercise<Identifiers, Options> = {
  id: "equa2",
  connector: "\\iff",
  label: "Équations $ax=b$",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro", "1reTech"],
  sections: ["Équations"],
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getEquationType2ExerciseQuestion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  options,
  rebuildIdentifiers,
};
