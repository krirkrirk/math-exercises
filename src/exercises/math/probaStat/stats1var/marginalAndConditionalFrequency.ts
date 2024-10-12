import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { shuffle } from "#root/utils/alea/shuffle";
import {
  Exercise,
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

const getAnswer = (
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
      freqString = "marginale de A";
      frequence = "f(A)";
      answer = new Rational(x1 + x3, x).simplify().toTree();
      break;
    case 1:
      freqString = "marginale de B";
      frequence = "f(B)";
      answer = new Rational(x2 + x4, x).simplify().toTree();
      break;
    case 2:
      freqString = "marginale de C";
      frequence = "f(C)";
      answer = new Rational(x1 + x2, x).simplify().toTree();
      break;
    case 3:
      freqString = "marginale de D";
      frequence = "f(D)";
      answer = new Rational(x3 + x4, x).simplify().toTree();
      break;
    case 4:
      freqString = "conditionnelle de A parmi C";
      frequence = "f_C(A)";
      answer = new Rational(x1, x1 + x2).simplify().toTree();
      break;
    case 5:
      freqString = "conditionnelle de A parmi D";
      frequence = "f_D(A)";
      answer = new Rational(x3, x3 + x4).simplify().toTree();
      break;
    case 6:
      freqString = "conditionnelle de B parmi C";
      frequence = "f_C(B)";
      answer = new Rational(x2, x1 + x2).simplify().toTree();
      break;
    case 7:
      freqString = "conditionnelle de B parmi D";
      frequence = "f_D(B)";
      answer = new Rational(x4, x3 + x4).simplify().toTree();
      break;
    case 8:
      freqString = "conditionnelle de C parmi A";
      frequence = "f_A(C)";
      answer = new Rational(x1, x1 + x3).simplify().toTree();
      break;
    case 9:
      freqString = "conditionnelle de C parmi B";
      frequence = "f_B(C)";
      answer = new Rational(x2, x2 + x4).simplify().toTree();
      break;
    case 10:
      freqString = "conditionnelle de D parmi A";
      frequence = "f_A(D)";
      answer = new Rational(x3, x1 + x3).simplify().toTree();
      break;
    case 11:
      freqString = "conditionnelle de D parmi B";
      frequence = "f_B(D)";
      answer = new Rational(x4, x2 + x4).simplify().toTree();
      break;
    default:
      throw Error("error");
  }
  return { answer, freqString, frequence };
};
const getMarginalAndConditionalFrequency: QuestionGenerator<
  Identifiers
> = () => {
  const [x1, x2, x3, x4] = [1, 2, 3, 4].map((el) => randint(1, 100));
  const rand = randint(0, 12);
  const {
    freqString,
    frequence,
    answer: answerTree,
  } = getAnswer(rand, x1, x2, x3, x4);
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `On considère le tableau d'effectifs suivant : 

| |A|B|
|-|-|-|
|C|${x1}|${x2}|
|D|${x3}|${x4}|

Calculer la fréquence ${freqString}.`,
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
    // console.log("marg and cond freq", answer, rand, x1, x2, x3, x4);
    const { answer: answerTree } = getAnswer(fakeRand, x1, x2, x3, x4);

    tryToAddWrongProp(propositions, answerTree.toTex());
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { rand, x1, x2, x3, x4 }) => {
  const { answer: answerTree } = getAnswer(rand, x1, x2, x3, x4);
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
};
