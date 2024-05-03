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

type Identifiers = {};

type ExerciseType = {
  instruction: string;
  answer: EqualNode;
  randAdd: number;
};

const getEquationFromSentenceExericseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const question: Question<Identifiers> = {
    answer: exercise.answer.toTex(),
    instruction: ``,
    keys: [],
    answerFormat: "tex",
    identifiers: {},
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

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const generateExercise = (): ExerciseType => {
  const rand = randint(1, 4);
  const flip = coinFlip();
  const resultNb = randint(-50, 51) * 2;
  const x = new VariableNode("x");
  const randAdd = randint(-11, 10, [0]);
  let instruction = "";
  let answer: EqualNode = new EqualNode(x, x);
  switch (rand) {
    case 1:
      instruction = `On appelle x le nombre à trouver. 
      Traduire par une équation la phrase "${
        flip ? `Le double` : `La moitié`
      } du nombre à trouver vaut ${resultNb}"`;
      answer = new EqualNode(
        flip
          ? new MultiplyNode(x, new NumberNode(2))
          : new FractionNode(new NumberNode(2), x),
        new NumberNode(resultNb),
      );
      break;
    case 2:
      instruction = `On appelle x le nombre à trouver. 
      Traduire par une équation la phrase "${
        flip ? `La somme` : `La différence`
      } du nombre à trouver et de ${randAdd} a pour résultat ${resultNb}"`;
      answer = new EqualNode(
        flip
          ? new AddNode(x, new NumberNode(randAdd))
          : new SubstractNode(x, new NumberNode(randAdd)),
        new NumberNode(resultNb),
      );
      break;
    case 3:
      const op2 = coinFlip() ? `augmenté` : `diminué`;
      instruction = `On appelle x le nombre à trouver. 
      Traduire par une équation la phrase "Le ${
        flip ? `double` : `la moitié`
      } du nombre à trouver ${op2} de ${randAdd} vaut ${resultNb}"`;
      answer = new EqualNode(
        op2
          ? new AddNode(
              flip
                ? new MultiplyNode(new NumberNode(2), x)
                : new FractionNode(x, new NumberNode(2)),
              new NumberNode(randAdd),
            )
          : new SubstractNode(
              flip
                ? new MultiplyNode(new NumberNode(2), x)
                : new FractionNode(x, new NumberNode(2)),
              new NumberNode(randAdd),
            ),
        new NumberNode(resultNb),
      );
      break;
  }
  return { instruction, answer, randAdd };
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
