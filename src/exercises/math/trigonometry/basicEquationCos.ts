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
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  degree: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, degree }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  //distracteur avec une solution manquante
  if (degree !== 0 && degree !== 180) {
    const answerNode = getAnswerNode({ degree });
    const newSet = answerNode.solutionsSet.toDeleteRandomElement();
    tryToAddWrongProp(propositions, new EquationSolutionNode(newSet).toTex());
  }

  while (propositions.length < n) {
    const value = random(mainPositiveTrigovalues);
    const randDegree = value.degree;
    tryToAddWrongProp(propositions, getAnswer({ degree: randDegree }));
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {
  const value = mainTrigoValues.find((v) => v.degree === identifiers.degree)!;
  if (value.degree === 0 || value.degree === 180)
    return new EquationSolutionNode(new DiscreteSetNode([value.angle]));
  const ans2 = value.angle;
  const ans1 = new OppositeNode(value.angle);
  return new EquationSolutionNode(new DiscreteSetNode([ans1, ans2]));
};
const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return getAnswerNode(identifiers).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const cos = mainTrigoValues.find((v) => v.degree === identifiers.degree)!.cos;
  return `Résoudre : 
  
$$
${new CosNode("x".toTree()).toTex()}=${cos.toTex()}
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

const getBasicEquationCosQuestion: QuestionGenerator<Identifiers> = () => {
  const value = random(mainPositiveTrigovalues);
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

export const basicEquationCos: Exercise<Identifiers> = {
  id: "basicEquationCos",
  connector: "\\iff",
  label: "Résoudre une équation du type $\\cos\\left(x\\right)=k$",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getBasicEquationCosQuestion, nb, 9),
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
