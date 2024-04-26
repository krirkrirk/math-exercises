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
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

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
  const question: Question<Identifiers> = {
    answer: answer,
    instruction: `Résoudre l'équation suivante : $${a}x = ${b}$`,
    keys: ["x", "equal"],
    answerFormat: "tex",
    identifiers: { a: a, x: x, b: b },
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
  label: "Résoudre une équation du premier degré du type $ax = b$",
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
