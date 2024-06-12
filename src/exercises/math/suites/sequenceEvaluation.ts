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
import { Affine } from "#root/math/polynomials/affine";
import { randTupleInt } from "#root/math/utils/random/randTupleInt";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  termeid: number;
  affine: number[];
  termeAdd?: number;
  termeMult?: number;
};

const getSequenceEvaluationQuestion: QuestionGenerator<Identifiers> = () => {
  const termeid = randint(1, 3);

  const affine = new Affine(randint(-10, 10, [0]), randint(-10, 10), "n");

  let terme: AddNode | MultiplyNode;
  let termeAdd: number | undefined;
  let termeMult: number | undefined;

  if (termeid === 1) {
    termeAdd = randint(1, 4);
    terme = new AddNode(new VariableNode("n"), new NumberNode(termeAdd));
  } else if (termeid === 2) {
    termeMult = randint(2, 4);
    terme = new MultiplyNode(new NumberNode(termeMult), new VariableNode("n"));
  } else {
    termeAdd = randint(1, 4);
    termeMult = randint(1, 4);
    terme = new AddNode(
      new MultiplyNode(new NumberNode(termeMult), new VariableNode("n")),
      new NumberNode(termeAdd),
    );
  }

  const a = new MultiplyNode(new NumberNode(affine.a), terme).simplify({
    forbidFactorize: true,
  });
  const b = new AddNode(a, new NumberNode(affine.b)).simplify({
    forbidFactorize: true,
  });
  const answer = b;

  const question: Question<Identifiers> = {
    answer: answer.toTex(),
    instruction: `Soit $(u_n)$ une suite telle que : $u_n = ${affine.toTex()}$, calculez la valeur de $u_{${terme.toTex()}}$`,
    keys: ["n"],
    answerFormat: "tex",
    identifiers: {
      termeid,
      affine: [affine.a, affine.b],
      termeAdd,
      termeMult,
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
  { affine, termeid, termeAdd, termeMult },
) => {
  const affine1 = new Affine(affine[0], affine[1], "n");

  let terme: AddNode | MultiplyNode;
  if (termeid === 1) {
    terme = new AddNode(new VariableNode("n"), new NumberNode(termeAdd!));
  } else if (termeid === 2) {
    terme = new MultiplyNode(new NumberNode(termeMult!), new VariableNode("n"));
  } else {
    terme = new AddNode(
      new MultiplyNode(new NumberNode(termeMult!), new VariableNode("n")),
      new NumberNode(termeAdd!),
    );
  }

  const a = new MultiplyNode(new NumberNode(affine1.a), terme).simplify({
    forbidFactorize: true,
  });
  const b = new AddNode(a, new NumberNode(affine1.b));
  const validanswer = b;

  const latexs = validanswer.toAllValidTexs();
  return latexs.includes(ans);
};

export const sequenceEvaluation: Exercise<Identifiers> = {
  id: "sequenceEvaluation",
  label: "Évaluer un terme d'une suite",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Suites"],
  generator: (nb: number) =>
    getDistinctQuestions(getSequenceEvaluationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
