import {
  MathExercise,
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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { EqualNode } from "#root/tree/nodes/operators/equalNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

const getEuclideanDivisionQuestions: QuestionGenerator<
  QCMProps,
  VEAProps
> = () => {
  let dividend = randint(5, 100);
  let divisor = randint(2, 11);

  while (dividend % divisor === 0) {
    dividend = randint(5, 100);
    divisor = randint(2, 11);
  }

  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;

  const answer = new EqualNode(
    new NumberNode(dividend),
    new AddNode(
      new MultiplyNode(new NumberNode(divisor), new NumberNode(quotient)),
      new NumberNode(remainder),
    ),
  );
  const answerTex = answer.toTex();
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Ecrire la division euclidienne de ${dividend} par ${divisor}.`,
    answer: answerTex,
    keys: ["equal"],
    answerFormat: "tex",
    qcmGeneratorProps: { answer: answerTex, dividend },
    veaProps: { dividend, divisor, quotient, remainder },
  };
  return question;
};

type VEAProps = {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
};
const isAnswerValid: VEA<VEAProps> = (
  ans,
  { dividend, divisor, quotient, remainder },
) => {
  const tree = new EqualNode(
    new NumberNode(dividend),
    new AddNode(
      new MultiplyNode(new NumberNode(divisor), new NumberNode(quotient)),
      new NumberNode(remainder),
    ),
    { allowRawRightChildAsSolution: true },
  );
  const validLatexs = tree.toAllValidTexs();
  return validLatexs.includes(ans);
};

type QCMProps = {
  answer: string;
  dividend: number;
};
const getPropositions: QCMGenerator<QCMProps> = (n, { answer, dividend }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const divisor = randint(2, 11);
    const quotient = Math.floor(randint(5, 100) / divisor);
    const remainder = randint(5, 100) % divisor;
    const wrongAnswer = new EqualNode(
      new NumberNode(dividend),
      new AddNode(
        new MultiplyNode(new NumberNode(divisor), new NumberNode(quotient)),
        new NumberNode(remainder),
      ),
    );
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }
  return shuffleProps(propositions, n);
};

export const euclideanDivision: MathExercise<QCMProps, VEAProps> = {
  id: "euclideanDivision",
  connector: "=",
  label: "Ecrire une division euclidienne",
  levels: ["6ème", "5ème", "4ème"],
  sections: ["Arithmétique"],
  isSingleStep: true,
  generator: (nb) => getDistinctQuestions(getEuclideanDivisionQuestions, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
