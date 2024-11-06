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
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { DegreeNode } from "#root/tree/nodes/geometry/degree";
import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  radius: number;
  thetaInDegree: number | undefined;
  thetaInRadNodeIds: any | undefined;
  isThetaInDegree: boolean;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isThetaInDegree, radius },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    const thetaInDegree = isThetaInDegree ? randint(1, 360) : undefined;
    const thetaInRadNodeIds = isThetaInDegree
      ? undefined
      : new FractionNode(
          new MultiplyNode((2).toTree(), PiNode),
          randint(2, 20).toTree(),
        )
          .simplify()
          .toIdentifiers();
    tryToAddWrongProp(
      propositions,
      getAnswer({ isThetaInDegree, radius, thetaInDegree, thetaInRadNodeIds }),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {
  if (identifiers.isThetaInDegree) {
    return new FractionNode(
      new MultiplyNode(
        (identifiers.radius * identifiers.thetaInDegree!).toTree(),
        PiNode,
      ),
      (180).toTree(),
    ).simplify();
  } else {
    const node = NodeConstructor.fromIdentifiers(
      identifiers.thetaInRadNodeIds,
    ) as AlgebraicNode;
    return new MultiplyNode(identifiers.radius.toTree(), node).simplify();
  }
};
const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return getAnswerNode(identifiers).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  return `Soit $\\mathcal C$ un cercle de centre $O$ et de rayon $${
    identifiers.radius
  }$. Soient $A$ et $B$ deux points sur ce cercle. L'angle au centre $\\widehat{AOB}$ vaut $${
    identifiers.isThetaInDegree
      ? new DegreeNode(identifiers.thetaInDegree!).toTex()
      : NodeConstructor.fromIdentifiers(identifiers.thetaInRadNodeIds).toTex() +
        "\\ \\text{rad}"
  }$. Quelle est la longueur de l'arc de cercle $\\overset{\\Large \\frown}{AB}$ ?`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["pi"];
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, isThetaInDegree, radius, thetaInDegree, thetaInRadNodeIds },
) => {
  const node = getAnswerNode({
    isThetaInDegree,
    radius,
    thetaInDegree,
    thetaInRadNodeIds,
  });
  return node.toAllValidTexs().includes(ans);
};

const getArcLengthQuestion: QuestionGenerator<Identifiers> = () => {
  const radius = randint(1, 6);
  const isThetaInDegree = coinFlip();
  const thetaInDegree = isThetaInDegree ? randint(1, 360) : undefined;
  const thetaInRadNode = isThetaInDegree
    ? undefined
    : new FractionNode(
        new MultiplyNode((2).toTree(), PiNode),
        randint(2, 20).toTree(),
      ).simplify();
  const identifiers: Identifiers = {
    isThetaInDegree,
    radius,
    thetaInDegree,
    thetaInRadNodeIds: thetaInRadNode?.toIdentifiers(),
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
  };

  return question;
};

export const arcLength: Exercise<Identifiers> = {
  id: "arcLength",
  connector: "=",
  label:
    "Calculer la longueur d'un arc de cercle à partir de l'angle au centre",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getArcLengthQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",

  getAnswer,
};
