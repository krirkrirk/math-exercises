import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { alignTex } from "#root/utils/alignTex";

type Identifiers = {
  a: number;
  b: number;
  x: number;
};

const getFirstDegreeEquationIntQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(-15, 15, [0]);
  const x = randint(-15, 15, [0]);
  const b = a * x;
  const answer = new EqualNode(new VariableNode("x"), x.toTree()).toTex();
  const aMonom = new Affine(a, 0).toTree();
  const statementTex = new EqualNode(aMonom, new NumberNode(b)).toTex();
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'équation suivante : $${statementTex}$`,
    keys: ["x", "equal"],
    answerFormat: "tex",
    identifiers: { a: a, x: x, b: b },
    hint: `Il faut isoler $x$ à gauche. Pour cela, effectue l'opération des deux côtés de l'équation qui permet de supprimer la multiplication par $${a}$.`,
    correction: `Pour isoler $x$ à gauche, on divise les deux côtés de l'équation par $${a}$: 
    
${alignTex([
  [
    `${statementTex}`,
    "\\iff",
    new EqualNode(
      new FractionNode(aMonom, new NumberNode(a)),
      new FractionNode(b.toTree(), new NumberNode(a)),
    ).toTex(),
  ],
  ["", "\\iff", answer],
])}
    `,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const w1 = b - a;
  const w2 = b + a;
  let w3 = 0;

  if (b !== 0) {
    w3 = Math.floor(a / b);
  } else {
    w3 = Math.floor(randint(-10, 10));
  }

  const wrongAnswer1 = new EqualNode(
    new VariableNode("x"),
    w1.toTree(),
  ).toTex();
  const wrongAnswer2 = new EqualNode(
    new VariableNode("x"),
    w2.toTree(),
  ).toTex();
  const wrongAnswer3 = new EqualNode(
    new VariableNode("x"),
    w3.toTree(),
  ).toTex();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);

  while (propositions.length < n) {
    const random = randint(-10, 10);
    const wrongAnswer = new EqualNode(
      new VariableNode("x"),
      random.toTree(),
    ).toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, x }) => {
  const ans1 = new EqualNode(new VariableNode("x"), x.toTree());
  const latexs = ans1.toAllValidTexs({ allowRawRightChildAsSolution: true });
  return latexs.includes(ans);
};
export const firstDegreeEquationIntType1: Exercise<Identifiers> = {
  id: "firstDegreeEquationIntType1",
  label: "Résoudre une équation du type $ax = b$ (solution entière)",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Équations"],
  generator: (nb: number) =>
    getDistinctQuestions(getFirstDegreeEquationIntQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
