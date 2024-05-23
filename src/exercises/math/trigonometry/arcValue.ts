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
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { TanNode } from "#root/tree/nodes/functions/tanNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  trigFunction: string;
  trigValue: number;
  angleInDegrees: number;
};

const getArcValueQuestion: QuestionGenerator<Identifiers> = () => {
  const trigFunctions = ["sin", "cos", "tan"];
  const selectedFunction = trigFunctions[randint(0, trigFunctions.length)];
  let trigValue;
  let angleInRadians;
  let angleInDegrees;

  if (selectedFunction === "sin") {
    do {
      trigValue = round(Math.random(), 2);
      angleInRadians = Math.asin(trigValue);
      angleInDegrees = (angleInRadians * 180) / Math.PI;
    } while (angleInDegrees < 0);
  } else if (selectedFunction === "cos") {
    do {
      trigValue = round(Math.random(), 2);
      angleInRadians = Math.acos(trigValue);
      angleInDegrees = (angleInRadians * 180) / Math.PI;
    } while (angleInDegrees < 0);
  } else {
    do {
      trigValue = round(Math.random() * 2 - 1, 2);
      angleInRadians = Math.atan(trigValue);
      angleInDegrees = (angleInRadians * 180) / Math.PI;
    } while (angleInDegrees < 0);
  }

  const trigNode =
    selectedFunction === "sin"
      ? new SinNode(new VariableNode("\\theta"))
      : selectedFunction === "cos"
      ? new CosNode(new VariableNode("\\theta"))
      : new TanNode(new VariableNode("\\theta"));

  const instruction = `Quelle est la valeur en degrés de l'angle $\\theta$ si $${trigNode.toTex()} = ${trigValue.frenchify()}$ ? Arrondir à l'unité.`;
  const answer = round(angleInDegrees, 0).toTree().toTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { trigFunction: selectedFunction, trigValue, angleInDegrees },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, angleInDegrees, trigFunction, trigValue },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(0, 180).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const arcValue: Exercise<Identifiers> = {
  id: "arcValue",
  label: "Calculer l'angle en degrés donné une valeur trigonométrique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Trigonométrie"],
  generator: (nb: number) => getDistinctQuestions(getArcValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
