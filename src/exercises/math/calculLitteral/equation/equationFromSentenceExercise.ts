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
import { AffineConstructor } from "#root/math/polynomials/affine";
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
  vars: ExerciseVars;
};

type ExerciseType = {
  type: number;
  instruction: string;
  answer: EqualNode;
  vars: ExerciseVars;
};

type ExerciseVars = {
  flip: boolean;
  resultNb: number;
  randAdd?: number;
  op2?: string;
};
const x = new VariableNode("x");
const twoNode = new NumberNode(2);

const getEquationFromSentenceExerciseQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exercise = generateExercise();
  const question: Question<Identifiers> = {
    answer: exercise.answer.toTex(),
    instruction: exercise.instruction,
    keys: ["x", "equal"],
    answerFormat: "tex",
    identifiers: {
      type: exercise.type,
      vars: exercise.vars,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, type, vars },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generateProposition(type, vars).forEach((value) =>
    tryToAddWrongProp(propositions, value.toTex()),
  );
  let rand;
  while (propositions.length < n) {
    rand = new EqualNode(
      AffineConstructor.random().toTree(),
      new NumberNode(vars.resultNb),
    );
    tryToAddWrongProp(propositions, rand.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { type, vars }) => {
  const correctAnswer = getCorrectAnswer(type, vars);
  return correctAnswer.toAllValidTexs().includes(ans);
};

const generateProposition = (type: number, vars: ExerciseVars): EqualNode[] => {
  const randAddNode =
    type !== 1 ? new NumberNode(vars.randAdd as number) : new NumberNode(0);
  const resultNode = new NumberNode(vars.resultNb);
  const firstProposition = getFirstProposition(
    type,
    vars,
    randAddNode,
    resultNode,
  );
  const secondProposition = getSecondProposition(
    type,
    vars,
    randAddNode,
    resultNode,
  );
  return [firstProposition, secondProposition];
};

const getFirstProposition = (
  type: number,
  vars: ExerciseVars,
  randAddNode: NumberNode,
  resultNode: NumberNode,
): EqualNode => {
  switch (type) {
    case 1:
      return new EqualNode(
        vars.flip
          ? new FractionNode(x, twoNode).simplify()
          : new MultiplyNode(twoNode, x).simplify(),
        resultNode,
      );
    case 2:
      return new EqualNode(
        vars.flip
          ? new SubstractNode(x, randAddNode)
          : new AddNode(x, randAddNode),
        resultNode,
      );
    case 3:
      return new EqualNode(
        vars.op2 === "augmenté"
          ? new SubstractNode(
              vars.flip
                ? new MultiplyNode(twoNode, x).simplify()
                : new FractionNode(x, twoNode).simplify(),
              randAddNode,
            )
          : new AddNode(
              vars.flip
                ? new MultiplyNode(twoNode, x).simplify()
                : new FractionNode(x, twoNode).simplify(),
              randAddNode,
            ),
        resultNode,
      );
  }
  return new EqualNode(x, x);
};

const getSecondProposition = (
  type: number,
  vars: ExerciseVars,
  randAddNode: NumberNode,
  resultNode: NumberNode,
): EqualNode => {
  switch (type) {
    case 1:
      return new EqualNode(
        vars.flip
          ? new MultiplyNode(resultNode, twoNode).simplify()
          : new FractionNode(resultNode, twoNode).simplify(),
        x,
      );
    case 2:
      return new EqualNode(
        vars.flip
          ? new AddNode(resultNode, randAddNode).simplify()
          : new SubstractNode(resultNode, randAddNode).simplify(),
        x,
      );
    case 3:
      return new EqualNode(
        vars.op2 === "augmenté"
          ? new AddNode(
              vars.flip
                ? new FractionNode(twoNode, x).simplify()
                : new MultiplyNode(x, twoNode).simplify(),
              randAddNode,
            )
          : new SubstractNode(
              vars.flip
                ? new FractionNode(twoNode, x).simplify()
                : new MultiplyNode(x, twoNode).simplify(),
              randAddNode,
            ),
        resultNode,
      );
  }
  return new EqualNode(x, x);
};

const getCorrectAnswer = (type: number, vars: ExerciseVars): EqualNode => {
  const randAddNode = vars.randAdd
    ? new NumberNode(vars.randAdd as number)
    : new NumberNode(0);
  switch (type) {
    case 1:
      return new EqualNode(
        vars.flip
          ? new MultiplyNode(x, twoNode).simplify()
          : new FractionNode(x, twoNode).simplify(),
        new NumberNode(vars.resultNb),
      );
    case 2:
      return new EqualNode(
        vars.flip
          ? new AddNode(x, randAddNode)
          : new SubstractNode(x, randAddNode),
        new NumberNode(vars.resultNb),
      );
    case 3:
      return new EqualNode(
        vars.op2 === "augmenté"
          ? new AddNode(
              vars.flip
                ? new MultiplyNode(twoNode, x).simplify()
                : new FractionNode(x, twoNode).simplify(),
              randAddNode,
            )
          : new SubstractNode(
              vars.flip
                ? new MultiplyNode(twoNode, x).simplify()
                : new FractionNode(x, twoNode).simplify(),
              randAddNode,
            ),
        new NumberNode(vars.resultNb),
      );
  }
  return new EqualNode(x, x);
};

const generateExercise = (): ExerciseType => {
  const type = randint(1, 4);
  const flip = coinFlip();
  const resultNb = randint(1, 51) * 2;
  let randAdd;
  let op2;
  let instruction = "";
  switch (type) {
    case 1:
      instruction = `On appelle $x$ le nombre à trouver. 
      Traduire par une équation la phrase "${
        flip ? `Le double` : `La moitié`
      } du nombre à trouver vaut $${resultNb}$"`;
      break;
    case 2:
      randAdd = randint(1, 11);
      instruction = `On appelle $x$ le nombre à trouver. 
      Traduire par une équation la phrase "${
        flip ? `La somme` : `La différence`
      } du nombre à trouver et de $${randAdd}$ a pour résultat $${resultNb}$"`;
      break;
    case 3:
      randAdd = randint(1, 11);
      op2 = coinFlip() ? `augmenté` : `diminué`;
      instruction = `On appelle $x$ le nombre à trouver. 
      Traduire par une équation la phrase "${
        flip ? `Le double` : `La moitié`
      } du nombre à trouver ${op2} de $${randAdd}$ vaut $${resultNb}$"`;
      break;
  }
  const vars = { randAdd, resultNb, op2, flip };
  const answer = getCorrectAnswer(type, vars);
  return { type, instruction, answer, vars };
};
export const equationFromSentenceExericse: Exercise<Identifiers> = {
  id: "equationFromSentenceExercise",
  label: "Traduire une phrase en une equation Mathématique.",
  levels: ["5ème"],
  isSingleStep: true,
  sections: ["Calcul littéral"],
  generator: (nb: number) =>
    getDistinctQuestions(getEquationFromSentenceExerciseQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
