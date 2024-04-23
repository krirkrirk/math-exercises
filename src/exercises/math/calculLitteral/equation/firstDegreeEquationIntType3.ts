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
    ).simplify(),
    new AddNode(
      new MultiplyNode(c.toTree(), new VariableNode("x")),
      d.toTree(),
    ).simplify(),
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
  const w1 = new FractionNode((d - b).toTree(), (a - c).toTree());
  const w2 = new FractionNode((a + c).toTree(), (b + d).toTree());
  const w3 = Math.floor((a + c) / (d - b));
  const wrongAnswer1 = new EqualNode(new VariableNode("x"), w1).toTex();
  const wrongAnswer2 = new EqualNode(new VariableNode("x"), w2).toTex();
  const wrongAnswer3 = new EqualNode(
    new VariableNode("x"),
    w3.toTree(),
  ).toTex();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);
  while (propositions.length < n) {
    const random = randint(-15, 15);
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
    "Résoudre une équation du premier degré du type ${a}{x} + b = {c}{x} + d$",
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
