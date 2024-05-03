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
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  type: number;
  randAdd: number;
  resultNb: number;
  op2: string;
  flip: boolean;
};

type ExerciseType = {
  type: number;
  instruction: string;
  answer: EqualNode;
  randAdd: number;
  resultNb: number;
  op2: string;
  flip: boolean;
};

const getEquationFromSentenceExericseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const question: Question<Identifiers> = {
    answer: exercise.answer.toTex(),
    instruction: exercise.instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      type: exercise.type,
      randAdd: exercise.randAdd,
      resultNb: exercise.resultNb,
      op2: exercise.op2,
      flip: exercise.flip,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { type, randAdd, resultNb, op2, flip },
) => {
  const correctAnswer = getCorrectAnswer(type, randAdd, resultNb, op2, flip);
  return correctAnswer.toAllValidTexs().includes(ans);
};

const generateProposition = () => {};

const getCorrectAnswer = (
  type: number,
  randAdd: number,
  resultNb: number,
  op2: string,
  flip: boolean,
): EqualNode => {
  const x = new VariableNode("x");
  switch (type) {
    case 1:
      return new EqualNode(
        flip
          ? new MultiplyNode(x, new NumberNode(2)).simplify()
          : new FractionNode(new NumberNode(2), x).simplify(),
        new NumberNode(resultNb),
      );
    case 2:
      return new EqualNode(
        flip
          ? new AddNode(x, new NumberNode(randAdd))
          : new SubstractNode(x, new NumberNode(randAdd)).simplify(),
        new NumberNode(resultNb),
      );
    case 3:
      return new EqualNode(
        op2
          ? new AddNode(
              flip
                ? new MultiplyNode(new NumberNode(2), x).simplify()
                : new FractionNode(x, new NumberNode(2)).simplify(),
              new NumberNode(randAdd),
            )
          : new SubstractNode(
              flip
                ? new MultiplyNode(new NumberNode(2), x).simplify()
                : new FractionNode(x, new NumberNode(2)).simplify(),
              new NumberNode(randAdd),
            ).simplify(),
        new NumberNode(resultNb),
      );
  }
  return new EqualNode(x, x);
};

const generateExercise = (): ExerciseType => {
  const type = randint(1, 4);
  const flip = coinFlip();
  const resultNb = randint(-50, 51) * 2;
  const x = new VariableNode("x");
  const randAdd = randint(-11, 10, [0]);
  let op2 = "";
  let instruction = "";
  switch (type) {
    case 1:
      instruction = `On appelle x le nombre à trouver. 
      Traduire par une équation la phrase "${
        flip ? `Le double` : `La moitié`
      } du nombre à trouver vaut ${resultNb}"`;
      break;
    case 2:
      instruction = `On appelle x le nombre à trouver. 
      Traduire par une équation la phrase "${
        flip ? `La somme` : `La différence`
      } du nombre à trouver et de ${randAdd} a pour résultat ${resultNb}"`;
      break;
    case 3:
      op2 = coinFlip() ? `augmenté` : `diminué`;
      instruction = `On appelle x le nombre à trouver. 
      Traduire par une équation la phrase "Le ${
        flip ? `double` : `la moitié`
      } du nombre à trouver ${op2} de ${randAdd} vaut ${resultNb}"`;
      break;
  }
  const answer = getCorrectAnswer(type, randAdd, resultNb, op2, flip);
  return { type, instruction, answer, randAdd, resultNb, op2, flip };
};
export const equationFromSentenceExericse: Exercise<Identifiers> = {
  id: "equationFromSentenceExericse",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getEquationFromSentenceExericseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
