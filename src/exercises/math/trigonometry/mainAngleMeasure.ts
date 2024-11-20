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
import {
  RemarkableValue,
  mainTrigoValues,
} from "#root/math/trigonometry/remarkableValues";
import { randint } from "#root/math/utils/random/randint";
import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
import { PiNode } from "#root/tree/nodes/numbers/piNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  degree: number;
  multipleOf2PiToAdd: number;
  nodeIds: any;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, degree }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  let fakeValues: RemarkableValue[];
  if (degree % 90 === 0) {
    fakeValues = mainTrigoValues.filter((e) =>
      [0, 90, 180, 270].includes(e.degree),
    );
  } else if (degree % 60 === 0) {
    fakeValues = mainTrigoValues.filter((e) =>
      [60, 120, 240, 300].includes(e.degree),
    );
  } else if (degree % 45 === 0) {
    fakeValues = mainTrigoValues.filter((e) =>
      [45, 135, 225, 315].includes(e.degree),
    );
  } else {
    fakeValues = mainTrigoValues.filter((e) =>
      [30, 150, 210, 330].includes(e.degree),
    );
  }
  fakeValues.forEach((v) => tryToAddWrongProp(propositions, v.angle.toTex()));

  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const value = mainTrigoValues.find((e) => e.degree === identifiers.degree)!;
  return value.angle.toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const angle = NodeConstructor.fromIdentifiers(identifiers.nodeIds);
  return `Déterminer la mesure principale de l'angle : 
  
$$
${angle.toTex()}
$$
  `;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  const angle = NodeConstructor.fromIdentifiers(identifiers.nodeIds);

  return `La mesure principale d'un angle en radian est sa valeur appartenant à l'intervalle $]-\\pi; \\pi]$. Il faut donc ajouter (ou retirer) $2\\pi$ à $${angle.toTex()}$ jusqu'à ce que le résultat soit dans cet intervalle.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  return `a`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["pi"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, degree }) => {
  const value = mainTrigoValues.find((e) => e.degree === degree)!;
  try {
    const parsed = parseAlgebraic(ans);
    const simplified = parsed.simplify().toTex();
    return simplified === answer;
    // return value.angle.toAllValidTexs().includes(ans);
  } catch (err) {
    return false;
  }
};

const getMainAngleMeasureQuestion: QuestionGenerator<Identifiers> = () => {
  const value = random(mainTrigoValues);
  const multipleOf2PiToAdd = randint(-3, 4, [0]);
  const node = new AddNode(
    value.angle,
    new MultiplyNode((2 * multipleOf2PiToAdd).toTree(), PiNode),
  ).simplify();
  const identifiers: Identifiers = {
    degree: value.degree,
    multipleOf2PiToAdd,
    nodeIds: node.toIdentifiers(),
  };
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

export const mainAngleMeasure: Exercise<Identifiers> = {
  id: "mainAngleMeasure",
  connector: "=",
  label: "Déterminer la mesure principale d'un angle",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getMainAngleMeasureQuestion, nb),
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
