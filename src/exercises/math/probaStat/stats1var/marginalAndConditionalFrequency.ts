import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { shuffle } from "#root/utils/alea/shuffle";
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";
import {
  Exercise,
  GetInstruction,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../../exercise";
import { getDistinctQuestions } from "../../../utils/getDistinctQuestions";

type Identifiers = {
  x1: number;
  x2: number;
  x3: number;
  x4: number;
  rand: number;
};

const getFreqStrings = (rand: number) => {
  let freqString = "";
  let frequence = "";
  switch (rand) {
    case 0:
      freqString = "marginale de $A$";
      frequence = "f(A)";
      break;
    case 1:
      freqString = "marginale de $B$";
      frequence = "f(B)";
      break;
    case 2:
      freqString = "marginale de $C$";
      frequence = "f(C)";
      break;
    case 3:
      freqString = "marginale de $D$";
      frequence = "f(D)";
      break;
    case 4:
      freqString = "conditionnelle de $A$ parmi $C$";
      frequence = "f_C(A)";
      break;
    case 5:
      freqString = "conditionnelle de $A$ parmi $D$";
      frequence = "f_D(A)";
      break;
    case 6:
      freqString = "conditionnelle de $B$ parmi $C$";
      frequence = "f_C(B)";
      break;
    case 7:
      freqString = "conditionnelle de $B$ parmi $D$";
      frequence = "f_D(B)";
      break;
    case 8:
      freqString = "conditionnelle de $C$ parmi $A$";
      frequence = "f_A(C)";
      break;
    case 9:
      freqString = "conditionnelle de $C$ parmi $B$";
      frequence = "f_B(C)";
      break;
    case 10:
      freqString = "conditionnelle de $D$ parmi $A$";
      frequence = "f_A(D)";
      break;
    case 11:
      freqString = "conditionnelle de $D$ parmi $B$";
      frequence = "f_B(D)";
      break;
    default:
      throw Error("error");
  }
  return { freqString, frequence };
};

const getInstruction: GetInstruction<Identifiers> = ({
  x1,
  x2,
  x3,
  x4,
  rand,
}) => {
  const { freqString } = getFreqStrings(rand);
  return `On considère le tableau d'effectifs suivant : 

${mdTable([
  [" ", "$A$", "$B$"],
  ["$C$", dollarize(x1), dollarize(x2)],
  ["$D$", dollarize(x3), dollarize(x4)],
])}

Calculer la fréquence ${freqString}.`;
};

const getAnswerNode = (
  rand: number,
  x1: number,
  x2: number,
  x3: number,
  x4: number,
) => {
  const x = x1 + x2 + x3 + x4;
  let freqString: string;
  let frequence: string;
  let answer: Node;
  switch (rand) {
    case 0:
      answer = new Rational(x1 + x3, x).simplify().toTree();
      break;
    case 1:
      answer = new Rational(x2 + x4, x).simplify().toTree();
      break;
    case 2:
      answer = new Rational(x1 + x2, x).simplify().toTree();
      break;
    case 3:
      answer = new Rational(x3 + x4, x).simplify().toTree();
      break;
    case 4:
      answer = new Rational(x1, x1 + x2).simplify().toTree();
      break;
    case 5:
      answer = new Rational(x3, x3 + x4).simplify().toTree();
      break;
    case 6:
      answer = new Rational(x2, x1 + x2).simplify().toTree();
      break;
    case 7:
      answer = new Rational(x4, x3 + x4).simplify().toTree();
      break;
    case 8:
      answer = new Rational(x1, x1 + x3).simplify().toTree();
      break;
    case 9:
      answer = new Rational(x2, x2 + x4).simplify().toTree();
      break;
    case 10:
      answer = new Rational(x3, x1 + x3).simplify().toTree();
      break;
    case 11:
      answer = new Rational(x4, x2 + x4).simplify().toTree();
      break;
    default:
      throw Error("error");
  }
  return answer;
};
const getMarginalAndConditionalFrequency: QuestionGenerator<
  Identifiers
> = () => {
  const [x1, x2, x3, x4] = [1, 2, 3, 4].map((el) => randint(1, 100));
  const rand = randint(0, 12);
  const answerNode = getAnswerNode(rand, x1, x2, x3, x4);
  const answer = answerNode.toTex();
  const identifiers = { rand, x1, x2, x3, x4 };
  const { frequence } = getFreqStrings(rand);
  const question: Question<Identifiers> = {
    instruction: getInstruction(identifiers),
    startStatement: `${frequence}`,
    answer,
    keys: ["f", "cap", "underscore"],
    answerFormat: "tex",
    identifiers: { rand, x1, x2, x3, x4 },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rand, x1, x2, x3, x4 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const fakeRand = randint(0, 12);

    const answerTree = getAnswerNode(fakeRand, x1, x2, x3, x4);
    tryToAddWrongProp(propositions, answerTree.toTex());
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { rand, x1, x2, x3, x4 }) => {
  const answerTree = getAnswerNode(rand, x1, x2, x3, x4);
  const texs = answerTree.toAllValidTexs({ allowFractionToDecimal: true });
  return texs.includes(ans);
};

export const marginalAndConditionalFrequency: Exercise<Identifiers> = {
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
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
};
