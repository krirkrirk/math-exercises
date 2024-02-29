import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Monom } from "#root/math/polynomials/monom";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  c: number;
};

export const getConstantPrimitive: QuestionGenerator<Identifiers> = () => {
  const c = randint(-19, 20, [0]);
  const monom = new Monom(1, c);
  const answer = new AddNode(monom.toTree(), new VariableNode("C")).toTex();
  const question: Question<Identifiers> = {
    instruction: `Déterminer la forme générale des primitives de la fonction constante $f$ définie par $f(x) = ${c}$.`,
    startStatement: `F(x)`,
    answer,
    keys: ["x", "C"],
    answerFormat: "tex",
    identifiers: { c },
  };

  return question;
};
export const getConstantPrimitivePropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, c },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const cNode = new VariableNode("C");
  while (propositions.length < n) {
    const monom = new Monom(1, randint(-9, 10, [-1, 0, 1]));
    const wrongAnswer = new AddNode(monom.toTree(), cNode);
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

export const isConstantPrimitiveAnswerValid: VEA<Identifiers> = (
  ans,
  { c },
) => {
  const answer = new AddNode(new Monom(1, c).toTree(), new VariableNode("C"));
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

export const constantPrimitive: MathExercise<Identifiers> = {
  id: "constantPrimitive",
  connector: "=",
  label: "Primitive d'une constante",
  levels: ["TermSpé", "MathComp"],
  sections: ["Primitives"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getConstantPrimitive, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getConstantPrimitivePropositions,
  isAnswerValid: isConstantPrimitiveAnswerValid,
};
