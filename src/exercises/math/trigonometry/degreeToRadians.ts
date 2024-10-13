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
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { DegreeNode } from "#root/tree/nodes/geometry/degree";
import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  degree: number;
  radianNodeIds: any;
  isDegreeToRadian: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isDegreeToRadian },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    if (isDegreeToRadian) {
      const degree = randint(1, 360);
      const radianNode = new FractionNode(
        new MultiplyNode(degree.toTree(), PiNode),
        (180).toTree(),
      ).simplify();
      tryToAddWrongProp(propositions, radianNode.toTex());
    } else {
      tryToAddWrongProp(propositions, new DegreeNode(randint(1, 360)).toTex());
    }
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = ({
  degree,
  isDegreeToRadian,
  radianNodeIds,
}) => {
  if (isDegreeToRadian) {
    return NodeConstructor.fromIdentifiers(radianNodeIds).toTex();
  } else {
    return new DegreeNode(degree).toTex();
  }
};

const getInstruction: GetInstruction<Identifiers> = ({
  degree,
  isDegreeToRadian,
  radianNodeIds,
}) => {
  return isDegreeToRadian
    ? `Convertir en radians : 
  
$$
${new DegreeNode(degree).toTex()}
$$
`
    : `Convertir en degrés :

$$
${NodeConstructor.fromIdentifiers(radianNodeIds).toTex()}
$$
`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `On sait que $\\pi \\ \\text{rad}$ correspond à $180^\\circ$. Il suffit alors de faire un produit en croix.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const answer = getAnswer(identifiers);
  const radNode = NodeConstructor.fromIdentifiers(identifiers.radianNodeIds);
  return `On sait que $\\pi \\ \\text{rad}$ correspond à $180^\\circ$.
  
${
  identifiers.isDegreeToRadian
    ? `Pour convertir $${identifiers.degree}^\\circ$ en radians, on fait donc un produit en croix :
  
$$
\\frac{${identifiers.degree}\\times \\pi}{180} = ${answer}
$$
  `
    : `Pour convertir $${radNode.toTex()}\\ \\text{rad}$ en degrés, on fait donc un produit en croix :
  
$$
${radNode.toTex()}\\times \\frac{180}{\\pi} = ${answer}
$$
  `
}`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["pi", "degree"];
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, degree, isDegreeToRadian, radianNodeIds },
) => {
  if (isDegreeToRadian) {
    return NodeConstructor.fromIdentifiers(radianNodeIds)
      .toAllValidTexs()
      .includes(ans);
  } else {
    return new DegreeNode(degree).toAllValidTexs().includes(ans);
  }
};

const getIdentifiers = (prevIds?: any): Identifiers => {
  const isRemakableValue = coinFlip();
  const isDegreeToRadian = coinFlip();
  let degree: number;
  let radianNode: AlgebraicNode;
  if (isRemakableValue) {
    const value = random(remarkableTrigoValues);
    degree = value.degree;
    radianNode = value.angle;
  } else {
    // if(isDegreeToRadian){
    degree = randint(
      1,
      360,
      [
        0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 240, 255, 270, 300, 315,
        330, 360,
      ],
    );
    radianNode = new FractionNode(
      new MultiplyNode(degree.toTree(), PiNode),
      (180).toTree(),
    ).simplify();
    // }else {
    // radianNode =

    // }
  }
  return {
    degree,
    radianNodeIds: radianNode.toIdentifiers(),
    isDegreeToRadian,
  };
};

const getDegreeToRadiansQuestion: QuestionGenerator<Identifiers> = () => {
  const identifiers = getIdentifiers();
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

export const degreeToRadians: Exercise<Identifiers> = {
  id: "degreeToRadians",
  connector: "=",
  label: "Convertir des degrés en radians et vice-versa",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getDegreeToRadiansQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
