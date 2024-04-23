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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from "#root/tree/nodes/equations/equalNode";
import { ExpNode } from "#root/tree/nodes/functions/expNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  a: number;
  b: number;
};

const getEquaDiffAyPlusBQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11);

  const aNode = new NumberNode(a);
  const bNode = new NumberNode(b);
  const y = new VariableNode("y");
  const c = new VariableNode("C");
  const x = new VariableNode("x");

  const equaDiff = new EqualNode(
    new VariableNode("y'"),
    new AddNode(new MultiplyNode(aNode, y), bNode),
  );

  const fraction = new Rational(-b, a).simplify().toTree();

  const correctAnswer = new EqualNode(
    y,
    b != 0
      ? new AddNode(
          new MultiplyNode(c, new ExpNode(new MultiplyNode(aNode, x))),
          fraction,
        )
      : new MultiplyNode(c, new ExpNode(new MultiplyNode(aNode, x))),
  );

  const question: Question<Identifiers> = {
    answer: correctAnswer.toTex(),
    instruction: `Résoudre l'équation différentielle : $${equaDiff.toTex()}$ `,
    keys: ["y", "x", "equal", "C", "epower"],
    answerFormat: "tex",
    identifiers: { a: a, b: b },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const propos = generatePropositions(a, b);
  tryToAddWrongProp(propositions, propos[0].toTex());
  tryToAddWrongProp(propositions, propos[1].toTex());
  tryToAddWrongProp(propositions, propos[2].toTex());
  let generatedPropositions;
  while (propositions.length < n) {
    generatedPropositions = generatePropositions(
      a,
      randint(-11, 10, [0, 1, a]),
    );
    tryToAddWrongProp(propositions, generatedPropositions[0].toTex());
    tryToAddWrongProp(propositions, generatedPropositions[1].toTex());
    tryToAddWrongProp(propositions, generatedPropositions[2].toTex());
  }
  return shuffleProps(propositions, n);
};

const generatePropositions = (a: number, b: number): EqualNode[] => {
  const bB = b != 0 ? b : randint(-10, 11, [0]);
  let fraction = new Rational(-a, bB).simplify().toTree();
  const y = new VariableNode("y");
  const c = new VariableNode("C");
  const aMultx = new ExpNode(
    new MultiplyNode(new NumberNode(a), new VariableNode("x")),
  );

  const firstProps = new EqualNode(
    y,
    new AddNode(new MultiplyNode(c, aMultx), fraction),
  );

  fraction = new Rational(-bB, a).simplify().toTree();

  const secondProps = new EqualNode(
    y,
    new AddNode(
      new MultiplyNode(
        c,
        new ExpNode(
          new MultiplyNode(new NumberNode(bB), new VariableNode("x")),
        ),
      ),
      fraction,
    ),
  );
  const thirdProps = new EqualNode(
    y,
    new AddNode(new MultiplyNode(c, aMultx), fraction),
  );
  return [firstProps, secondProps, thirdProps];
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  let fraction = new Rational(-b, a).simplify().toTree();
  const c = new VariableNode("C");
  const aTimesX = new MultiplyNode(new NumberNode(a), new VariableNode("x"));
  const correctNode = new EqualNode(
    new VariableNode("y"),
    b != 0
      ? new AddNode(new MultiplyNode(c, new ExpNode(aTimesX)), fraction)
      : new MultiplyNode(c, new ExpNode(aTimesX)),
  );
  const validAnswers = correctNode.toAllValidTexs({
    allowFractionToDecimal: true,
    allowRawRightChildAsSolution: true,
  });
  return validAnswers.includes(ans);
};
export const equaDiffAyPlusB: Exercise<Identifiers> = {
  id: "equaDiffAyPlusB",
  label: "Résoudre une équation différentielle du type $y' = ay + b$",
  levels: ["TermSpé", "MathComp"],
  isSingleStep: true,
  sections: ["Équations différentielles"],
  generator: (nb: number) =>
    getDistinctQuestions(getEquaDiffAyPlusBQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
