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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randTupleInt } from "#root/math/utils/random/randTupleInt";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  termeid: number;
  affine: number[];
  termeAdd: number;
  termeMult: number;
};

const getSequenceEvaluationQuestion: QuestionGenerator<Identifiers> = () => {
  const termeid = randint(1, 3);

  const a = randint(-10, 10, [0]);
  const b = randint(-10, 10);
  const affine = new Affine(a, b, "n");

  let terme: AddNode | MultiplyNode;
  let termeAdd: number = 0;
  let termeMult: number = 1;

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

  let answer: AlgebraicNode;
  if (termeid === 1) {
    const innerTerm = new AddNode(
      new MultiplyNode(new NumberNode(a), new VariableNode("n")),
      new NumberNode(a * termeAdd),
    );
    answer = new AddNode(innerTerm, new NumberNode(b)).simplify({
      forbidFactorize: true,
    });
  } else if (termeid === 2) {
    const innerTerm = new MultiplyNode(
      new NumberNode(a * termeMult),
      new VariableNode("n"),
    );
    answer = new AddNode(innerTerm, new NumberNode(b)).simplify({
      forbidFactorize: true,
    });
  } else {
    const innerTerm = new AddNode(
      new MultiplyNode(new NumberNode(a * termeMult), new VariableNode("n")),
      new NumberNode(a * termeAdd),
    );
    answer = new AddNode(innerTerm, new NumberNode(b)).simplify({
      forbidFactorize: true,
    });
  }

  const question: Question<Identifiers> = {
    answer: answer.toTex(),
    instruction: `Soit $(u_n)$ une suite telle que $u_n = ${affine.toTex()}$. Exprimer $u_{${terme.toTex()}}$.`,
    keys: ["n"],
    answerFormat: "tex",
    identifiers: {
      termeid,
      affine: [a, b],
      termeAdd,
      termeMult,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, termeid, affine, termeAdd, termeMult },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const a = affine[0];
  const b = affine[1];
  let wrongAnswer: AlgebraicNode;
  if (termeid === 1) {
    const wrongInnerTerm = new AddNode(
      new MultiplyNode(new NumberNode(a), new VariableNode("n")),
      new NumberNode(a * (termeAdd + randint(-2, 2))),
    );
    wrongAnswer = new AddNode(
      wrongInnerTerm,
      new NumberNode(b + randint(-5, 5)),
    ).simplify({
      forbidFactorize: true,
    });
  } else if (termeid === 2) {
    const wrongInnerTerm = new MultiplyNode(
      new NumberNode(a * (termeMult + randint(-1, 1))),
      new VariableNode("n"),
    );
    wrongAnswer = new AddNode(
      wrongInnerTerm,
      new NumberNode(b + randint(-5, 5)),
    ).simplify({
      forbidFactorize: true,
    });
  } else {
    const wrongInnerTerm = new AddNode(
      new MultiplyNode(
        new NumberNode(a * (termeMult + randint(-1, 1))),
        new VariableNode("n"),
      ),
      new NumberNode(a * (termeAdd + randint(-2, 2))),
    );
    wrongAnswer = new AddNode(
      wrongInnerTerm,
      new NumberNode(b + randint(-5, 5)),
    ).simplify({
      forbidFactorize: true,
    });
  }
  tryToAddWrongProp(propositions, wrongAnswer.toTex());

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Affine(randint(-10, 10, [0]), randint(-10, 10), "n").toTree().toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { affine, termeid, termeAdd, termeMult },
) => {
  const a = affine[0];
  const b = affine[1];

  let terme: AddNode | MultiplyNode;
  if (termeid === 1) {
    terme = new AddNode(new VariableNode("n"), new NumberNode(termeAdd));
  } else if (termeid === 2) {
    terme = new MultiplyNode(new NumberNode(termeMult), new VariableNode("n"));
  } else {
    terme = new AddNode(
      new MultiplyNode(new NumberNode(termeMult), new VariableNode("n")),
      new NumberNode(termeAdd),
    );
  }

  let validanswer: AlgebraicNode;
  if (termeid === 1) {
    const innerTerm = new AddNode(
      new MultiplyNode(new NumberNode(a), new VariableNode("n")),
      new NumberNode(a * termeAdd),
    );
    validanswer = new AddNode(innerTerm, new NumberNode(b)).simplify({
      forbidFactorize: true,
    });
  } else if (termeid === 2) {
    const innerTerm = new MultiplyNode(
      new NumberNode(a * termeMult),
      new VariableNode("n"),
    );
    validanswer = new AddNode(innerTerm, new NumberNode(b)).simplify({
      forbidFactorize: true,
    });
  } else {
    const innerTerm = new AddNode(
      new MultiplyNode(new NumberNode(a * termeMult), new VariableNode("n")),
      new NumberNode(a * termeAdd),
    );
    validanswer = new AddNode(innerTerm, new NumberNode(b)).simplify({
      forbidFactorize: true,
    });
  }

  const latexs = validanswer.toAllValidTexs();
  return latexs.includes(ans);
};

export const sequenceEvaluation: Exercise<Identifiers> = {
  id: "sequenceEvaluation",
  label: "Exprimer $u_{f(n)}$ en connaissant $u_n$",
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
