import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  mainPositiveTrigovalues,
  mainTrigoValues,
  trigoValuesOnZeroTwoPIOF,
} from "#root/math/trigonometry/remarkableValues";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { DiscreteSetNode } from "#root/tree/nodes/sets/discreteSetNode";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { random } from "#root/utils/alea/random";

// résoudre sin(x) = k sur ]a; a+2pi] avec a  = kpi
type Identifiers = {
  degree: number;
  leftBoundPiMultiple: number;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {};
const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const coeff = identifiers.leftBoundPiMultiple;

  /**
   * Si l'intervalle est centré autour d'un multiple de 2pi (coeff impair) (genre ]3pi, 5pi]) on ajoute (coeff+1)/2 tours
   * Sinon (coeff pair) (genre ]2pi, 4pipi]) , on chope la value de ]0, 2pi] et on ajoute coeff/2 tours
   */
  const turnsToAdd = Math.abs(coeff % 2) === 1 ? (coeff + 1) / 2 : coeff / 2;
  const sin = mainTrigoValues
    .find((v) => v.degree === identifiers.degree)!
    .sin.evaluate({});
  const values = (
    Math.abs(coeff % 2) === 1 ? mainTrigoValues : trigoValuesOnZeroTwoPIOF
  ).filter((v) => v.sin.evaluate({}) === sin)!;
  if (values.length === 1) {
    const value = values[0];
    const newValue = new AddNode(
      value.angle,
      new MultiplyNode((turnsToAdd * 2).toTree(), PiNode),
    ).simplify();
    return (
      new EquationSolutionNode(new DiscreteSetNode([newValue])).toTex() +
      ` turns ${turnsToAdd}, value : ${value.angle.toTex()}`
    );
  } else {
    const newValues = values.map((v) => {
      return new AddNode(
        v.angle,
        new MultiplyNode((turnsToAdd * 2).toTree(), PiNode),
      ).simplify();
    });
    return (
      new EquationSolutionNode(
        new DiscreteSetNode(
          newValues.sort((a, b) => a.evaluate({}) - b.evaluate({})),
        ),
      ).toTex() +
      ` turns ${turnsToAdd}, values: ${values.map((v) => v.angle.toTex())}`
    );
  }
};

const getInstruction: GetInstruction<Identifiers> = ({
  degree,
  leftBoundPiMultiple,
}) => {
  const value = mainPositiveTrigovalues.find((v) => v.degree === degree)!;
  const leftBound = new MultiplyNode(
    leftBoundPiMultiple.toTree(),
    PiNode,
  ).simplify();
  const rightBound = new MultiplyNode(
    (leftBoundPiMultiple + 2).toTree(),
    PiNode,
  ).simplify();
  const interval = new IntervalNode(leftBound, rightBound, ClosureType.OF);
  return `Résoudre sur $${interval.toTex()}$ l'équation : 
    
  $$
  ${new SinNode("x".toTree()).toTex()}=${value.sin.toTex()}
  $$`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return "";
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return "";
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["pi"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const getEquationSinOnRandomIntervalQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const value = random(mainPositiveTrigovalues);
  const degree = value.degree;
  const leftBoundPiMultiple = randint(-3, 4);
  const identifiers: Identifiers = { degree, leftBoundPiMultiple };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const equationSinOnRandomInterval: Exercise<Identifiers> = {
  id: "equationSinOnRandomInterval",
  connector: "\\iff",
  label:
    "Résoudre une équation du type $\\Sin\\left(x\\right)=k$ sur un intervalle donné",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getEquationSinOnRandomIntervalQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
};
