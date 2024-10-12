import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Complex, ComplexConstructor } from "#root/math/complex/complex";
import { randint } from "#root/math/utils/random/randint";
import { ComplexNode } from "#root/tree/nodes/complex/complexNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  a: number;
  b: number;
  z1: number[];
  z2: number[];
};

const getLinearCombinaisonComplexQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const z1 = ComplexConstructor.random();
  const z2 = ComplexConstructor.random();
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11, [0]);

  const statement = new AddNode(
    new MultiplyNode(new NumberNode(a), new VariableNode("z_1")),
    new MultiplyNode(new NumberNode(b), new VariableNode("z_2")),
  );

  const answer = z1.times(a).add(z2.times(b)).toTree().toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $z_1=${z1.toTree().toTex()}$ et $z_2=${z2
      .toTree()
      .toTex()}$. Calculer $${statement.toTex()}$.`,
    keys: ["i", "z", "quote"],
    answerFormat: "tex",
    identifiers: { a, b, z1: [z1.re, z1.im], z2: [z2.re, z2.im] },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, b, z1, z2 }) => {
  const complex1 = new Complex(z1[0], z1[1]);
  const complex2 = new Complex(z2[0], z2[1]);
  const answerTree = complex1.times(a).add(complex2.times(b)).toTree();
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};
export const linearCombinaisonComplex: Exercise<Identifiers> = {
  id: "linearCombinaisonComplex",
  connector: "=",
  label: "Combinaison linéaire de deux nombres complexes",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) =>
    getDistinctQuestions(getLinearCombinaisonComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
