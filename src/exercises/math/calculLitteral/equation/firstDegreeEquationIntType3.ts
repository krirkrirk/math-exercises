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
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  x: number;
  b: number;
  c: number;
  d: number;
};

const getFirstDegreeEquationIntQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const a = randint(-15, 15, [0]);
  const x = randint(-15, 15, [0]);
  const c = randint(-15, 15, [0]);
  const d = randint(-15, 15, [0]);
  const b = d - (a - c) * x;
  const answer = new EqualNode(new VariableNode("x"), x.toTree()).toTex();
  const equation = new EqualNode(
    new AddNode(
      new MultiplyNode(a.toTree(), new VariableNode("x")),
      b.toTree(),
    ).simplify({forbidFactorize: true}),
    new AddNode(
      new MultiplyNode(c.toTree(), new VariableNode("x")),
      d.toTree(),
    ).simplify({forbidFactorize: true}),
  );
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'équation suivante :$${equation.toTex()}$`,
    keys: ["x", "equal"],
    answerFormat: "tex",
    identifiers: { a: a, x: x, b: b, c: c, d: d },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, c, d },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const denomW1 = a - c;
  let wrongAnswer1 = "";
  if (denomW1 !== 0) {
    const w1 = new FractionNode((d - b).toTree(), denomW1.toTree()).simplify();
    wrongAnswer1 = new EqualNode(new VariableNode("x"), w1).toTex();
  } else {
    wrongAnswer1 = new EqualNode(new VariableNode("x"), randint(-10, 10).toTree()).toTex();
  }
  
  const denomW2 = b + d;
  let wrongAnswer2 = "";
  if (denomW2 !== 0) {
    const w2 = new FractionNode((a + c).toTree(), denomW2.toTree()).simplify();
    wrongAnswer2 = new EqualNode(new VariableNode("x"), w2).toTex();
  } else {
    wrongAnswer2 = new EqualNode(new VariableNode("x"), randint(-10, 10).toTree()).toTex();
  }
  
  const wrongAnswer3 = new EqualNode(
    new VariableNode("x"), Math.floor(((a + c) / (denomW1 === 0 ? 1 : denomW1))).toTree(),
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
export const firstDegreeEquationIntType3: Exercise<Identifiers> = {
  id: "firstDegreeEquationIntType3",
  label:
    "Résoudre une équation du premier degré du type $ax + b = cx + d$",
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
};
