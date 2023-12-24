import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { simplifyNode } from "#root/tree/parsers/simplify";
import { shuffle } from "#root/utils/shuffle";
import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

type QCMProps = {
  answer: string;
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  rand: number;
};
type VEAProps = {
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  rand: number;
};

const getCalculs = (x1: number, x2: number, x3: number, x4: number) => {
  const x = x1 + x2 + x3 + x4;
  return [
    (x1 + x3) / x,
    (x2 + x4) / x,
    (x1 + x2) / x,
    (x3 + x4) / x,
    x1 / (x1 + x2),
    x3 / (x3 + x4),
    x2 / (x1 + x2),
    x4 / (x3 + x4),
    x1 / (x1 + x3),
    x3 / (x1 + x3),
    x2 / (x2 + x4),
    x4 / (x2 + x4),
  ];
};
const getMarginalAndConditionalFrequency: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  const [x1, x2, x3, x4] = [1, 2, 3, 4].map((el) => randint(1, 100));
  const rand = randint(0, 12);

  const freqString = [
    "marginale de A",
    "marginale de B",
    "marginale de C",
    "marginale de D",
    "conditionnelle de A parmi C",
    "conditionnelle de A parmi D",
    "conditionnelle de B parmi C",
    "conditionnelle de B parmi D",
    "conditionnelle de C parmi A",
    "conditionnelle de C parmi B",
    "conditionnelle de D parmi A",
    "conditionnelle de D parmi B",
  ];

  const frequences = [
    "f(A)",
    "f(B)",
    "f(C)",
    "f(D)",
    "f_C(A)",
    "f_D(A)",
    "f_C(B)",
    "f_D(B)",
    "f_A(C)",
    "f_B(C)",
    "f_A(D)",
    "f_B(D)",
  ];

  const calculs = getCalculs(x1, x2, x3, x4);
  const chosenCalculNode = simplifyNode(new NumberNode(calculs[rand]));
  const answer = chosenCalculNode.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `On considère le tableau d'effectifs suivant : 

| |A|B|
|-|-|-|
|C|${x1}|${x2}|
|D|${x3}|${x4}|

Calculer la fréquence ${freqString[rand]}.`,
    startStatement: `${frequences[rand]}`,
    answer,
    keys: ["f", "cap", "underscore"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer, rand, x1, x2, x3, x4 },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (
  n,
  { answer, x1, x2, x3, x4 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const calculs = getCalculs(x1, x2, x3, x4);
  while (propositions.length < n) {
    const rand = randint(0, 12);
    tryToAddWrongProp(
      propositions,
      simplifyNode(new NumberNode(calculs[rand])).toTex(),
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<VEAProps> = (ans, { rand, x1, x2, x3, x4 }) => {
  const calculs = getCalculs(x1, x2, x3, x4);
  const chosenCalculNode = simplifyNode(new NumberNode(calculs[rand]));
  const answer = chosenCalculNode;
};

export const marginalAndConditionalFrequency: MathExercise<QCMProps, VEAProps> =
  {
    id: "marginalAndConditionalFrequency",
    connector: "=",
    label: "Calculs de fréquences marginales et conditionnelles",
    levels: ["1reESM", "1reSpé", "1reTech", "TermTech", "1rePro", "TermPro"],
    isSingleStep: false,
    sections: ["Statistiques"],
    generator: (nb: number) =>
      getDistinctQuestions(getMarginalAndConditionalFrequency, nb),
    qcmTimer: 60,
    freeTimer: 60,
    getPropositions,
  };
