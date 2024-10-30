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
import { ArcsinNode } from "#root/tree/nodes/functions/arcSinNode";
import { ArccosNode } from "#root/tree/nodes/functions/arccosNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { ArctanNode } from "#root/tree/nodes/functions/arctanNode";

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

  const reciprocalFunction =
    selectedFunction === "sin"
      ? { name: "arcsin", otherName: "\\sin^{-1}", node: ArcsinNode }
      : selectedFunction === "cos"
      ? { name: "arccos", otherName: "\\cos^{-1}", node: ArccosNode }
      : { name: "arctan", otherName: "\\tan^{-1}", node: ArctanNode };
  const instruction = `Quelle est la valeur en degrés de l'angle $\\theta$ sachant que $${trigNode.toTex()} = ${trigValue.frenchify()}$ ? Arrondir à l'unité.`;
  const answer = round(angleInDegrees, 0).toTree().toTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: instruction,
    keys: [],
    answerFormat: "tex",
    hint: `La valeur de $\\theta$ s'obtient en calculant l'${
      reciprocalFunction.name
    } (ou $${
      reciprocalFunction.otherName
    }$) de la valeur $${trigValue.frenchify()}$, avec la calculatrice.`,
    correction: `On calcule l'${reciprocalFunction.name} (ou $${
      reciprocalFunction.otherName
    }$) de  $${trigValue.frenchify()}$ avec la calculatrice : 
    
${alignTex([
  [
    `${new reciprocalFunction.node(new NumberNode(trigValue)).toTex()}`,
    "\\approx",
    round(angleInDegrees, 3).toTree().toTex(),
  ],
])}

En arrondissant à l'unité, on a donc $\\theta \\approx ${answer}^{\\circ}$.`,

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
  label: "Calculer un angle via son cosinus/sinus/tangente",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Trigonométrie"],
  generator: (nb: number) => getDistinctQuestions(getArcValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
