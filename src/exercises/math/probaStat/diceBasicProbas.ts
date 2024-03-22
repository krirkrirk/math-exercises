import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { NodeOptions } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { coinFlip } from "#root/utils/coinFlip";
import { probaFlip } from "#root/utils/probaFlip";
type Identifiers = {
  isParityQuestion: boolean;
  isEvenQuestion: boolean;
  nbFaces: number;
};

const getDiceBasicProbasQuestion: QuestionGenerator<Identifiers> = () => {
  const nbFaces = randint(4, 10);
  const isParityQuestion = probaFlip(0.3);
  const isEvenQuestion = coinFlip();
  const faceAsked = randint(1, nbFaces + 1);
  const target = isParityQuestion
    ? `un nombre ${isEvenQuestion ? "pair" : "impair"}`
    : `la face ${faceAsked}`;
  const answer = isParityQuestion
    ? isEvenQuestion
      ? new Rational(Math.floor(nbFaces / 2), nbFaces).simplify().tex
      : new Rational(Math.ceil(nbFaces / 2), nbFaces).simplify().tex
    : `\\frac{1}{${nbFaces}}`;

  const question: Question<Identifiers> = {
    answer,
    instruction: `On lance un dé équilibré à ${nbFaces} faces. Quelle est la probabilité d'obtenir ${target} ?`,
    keys: [],
    answerFormat: "tex",
    identifiers: { isParityQuestion, isEvenQuestion, nbFaces },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, isParityQuestion, isEvenQuestion, nbFaces },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (isParityQuestion) {
    tryToAddWrongProp(propositions, "\\frac{1}{2}");
    if (isEvenQuestion)
      tryToAddWrongProp(
        propositions,
        new Rational(Math.ceil(nbFaces / 2), nbFaces).simplify().tex,
      );
    else
      tryToAddWrongProp(
        propositions,
        new Rational(Math.floor(nbFaces / 2), nbFaces).simplify().tex,
      );
  } else {
    tryToAddWrongProp(propositions, "1");
    tryToAddWrongProp(propositions, "\\frac{1}{6}");
  }

  while (propositions.length < n) {
    const wrongAnswer = new Rational(
      randint(1, nbFaces + 1),
      nbFaces,
    ).simplify().tex;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { isParityQuestion, isEvenQuestion, nbFaces },
) => {
  const opts: NodeOptions = { allowFractionToDecimal: true };
  const answer = isParityQuestion
    ? isEvenQuestion
      ? new Rational(Math.floor(nbFaces / 2), nbFaces).simplify().toTree(opts)
      : new Rational(Math.ceil(nbFaces / 2), nbFaces).simplify().toTree(opts)
    : new FractionNode(new NumberNode(1), new NumberNode(nbFaces), opts);
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const diceBasicProbas: Exercise<Identifiers> = {
  id: "diceBasicProbas",
  connector: "=",
  label: "Calcul de probabilité simple avec un dé",
  levels: ["5ème", "4ème", "3ème", "2ndPro", "2nde", "CAP"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getDiceBasicProbasQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
