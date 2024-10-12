import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { mainTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  degree: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const value = random(mainTrigoValues);
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(new DiscreteSetNode([value.angle])).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {
  const value = mainTrigoValues.find((v) => v.degree === identifiers.degree)!;
  return new EquationSolutionNode(new DiscreteSetNode([value.angle]));
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return getAnswerNode(identifiers).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const value = mainTrigoValues.find((v) => v.degree === identifiers.degree)!;
  return `Résoudre : 
  
$$
\\left\\{${alignTex(
    [
      [`${new CosNode("x".toTree()).toTex()}=${value.cos.toTex()}`],
      [`${new SinNode("x".toTree()).toTex()}=${value.sin.toTex()}`],
    ],
    true,
  )}\\right.
$$

Donner les solutions dans l'intervalle $\\left]-\\pi,\\pi\\right]$.
`;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {};
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["x", "S", "equal", "lbrace", "semicolon", "rbrace", "pi"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, degree }) => {
  const node = getAnswerNode({ degree });
  return node.toAllValidTexs().includes(ans);
};

const getBasicTrigoSystemEquationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const value = random(mainTrigoValues);
  const degree = value.degree;
  const identifiers: Identifiers = {
    degree,
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

export const basicTrigoSystemEquation: Exercise<Identifiers> = {
  id: "basicTrigoSystemEquation",
  connector: "\\iff",
  label:
    "Résoudre un système du type $\\left\\{\\begin{matrix}\\cos(x)=a\\\\ \\sin(x)=b\\end{matrix}\\right.$",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getBasicTrigoSystemEquationQuestion, nb, 15),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  maxAllowedQuestions: 15,
};
