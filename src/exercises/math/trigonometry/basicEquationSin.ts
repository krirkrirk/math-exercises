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
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import {
  mainPositiveTrigovalues,
  mainTrigoValues,
  remarkableTrigoValues,
} from "#root/math/trigonometry/remarkableValues";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  degree: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, degree }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  //distracteur avec une solution manquante
  if (degree !== 90 && degree !== 270) {
    const answerNode = getAnswerNode({ degree });
    const newSet = answerNode.solutionsSet.toDeleteRandomElement();
    tryToAddWrongProp(propositions, new EquationSolutionNode(newSet).toTex());
  }
  const mainSinusValues = mainTrigoValues.slice(3, 12);

  while (propositions.length < n) {
    const value = random(mainSinusValues);
    const randDegree = value.degree;
    tryToAddWrongProp(propositions, getAnswer({ degree: randDegree }));
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {
  const value = mainTrigoValues.find((v) => v.degree === identifiers.degree)!;
  if (value.degree === 90 || value.degree === 270)
    return new EquationSolutionNode(new DiscreteSetNode([value.angle]));
  const isNegative = value.degree > 270;
  let ans1: AlgebraicNode;
  let ans2: AlgebraicNode;
  if (isNegative) {
    ans2 = value.angle;
    const oppositeDegree = 270 - (value.degree - 270);
    ans1 = mainTrigoValues.find((v) => v.degree === oppositeDegree)!.angle;
  } else {
    ans1 = value.angle;
    const oppositeDegree = 90 + (90 - value.degree);
    ans2 = mainTrigoValues.find((v) => v.degree === oppositeDegree)!.angle;
  }
  return new EquationSolutionNode(new DiscreteSetNode([ans1, ans2]));
};
const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return getAnswerNode(identifiers).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const sin = mainTrigoValues.find((v) => v.degree === identifiers.degree)!.sin;
  return `Résoudre : 
    
  $$
  ${new SinNode("x".toTree()).toTex()}=${sin.toTex()}
  $$
  
  Donner les solutions dans l'intervalle $\\left]-\\pi,\\pi\\right]$.
  `;
};

// const getHint: GetHint<Identifiers> = (identifiers) => {
//   return "";
// };
// const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
//   return "";
// };

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["x", "S", "equal", "lbrace", "semicolon", "rbrace", "pi"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, degree }) => {
  const answerNode = getAnswerNode({ degree });
  return answerNode.toAllValidTexs().includes(ans);
};

const getBasicEquationSinQuestion: QuestionGenerator<Identifiers> = () => {
  const mainSinusValues = mainTrigoValues.slice(3, 12);
  const value = random(mainSinusValues);
  const degree = value.degree;
  const identifiers: Identifiers = { degree };
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

export const basicEquationSin: Exercise<Identifiers> = {
  id: "basicEquationSin",
  connector: "\\iff",
  label: "Résoudre une équation du type $\\sin\\left(x\\right)=k$",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getBasicEquationSinQuestion, nb, 9),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  // getHint,
  // getCorrection,
  getAnswer,
  maxAllowedQuestions: 9,
};
