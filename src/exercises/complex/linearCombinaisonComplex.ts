import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Complex, ComplexConstructor } from "#root/math/complex/complex";
import { randint } from "#root/math/utils/random/randint";
import { ComplexNode } from "#root/tree/nodes/complex/complexNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";
import { simplifyComplex, simplifyNode } from "#root/tree/parsers/simplify";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  answer: string;
};
type VEAProps = {};
const getLinearCombinaisonComplexQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const z1 = ComplexConstructor.random();
  const z2 = ComplexConstructor.random();
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11, [0]);

  const statement = simplifyNode(
    new AddNode(
      new MultiplyNode(new NumberNode(a), new VariableNode("z_1")),
      new MultiplyNode(new NumberNode(b), new VariableNode("z_2")),
    ),
  );
  //   const statement = simplify(`${a}z+${b}z'`);
  const answer = simplifyComplex(
    new AddNode(
      new MultiplyNode(new NumberNode(a), z1.toTree()),
      new MultiplyNode(new NumberNode(b), z2.toTree()),
    ),
  ).toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $z_1=${z1.toTree().toTex()}$ et $z_2=${z2
      .toTree()
      .toTex()}$. Calculer $${statement.toTex()}$.`,
    keys: ["i", "z", "quote"],
    answerFormat: "tex",
    identifiers: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const wrongAnswer = ComplexConstructor.random();

    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  }

  return shuffle(propositions);
};
export const linearCombinaisonComplex: MathExercise<Identifiers> = {
  id: "linearCombinaisonComplex",
  connector: "=",
  label: "Combinaison linéaire de deux nombres complexes",
  levels: ["MathExp"],
  isSingleStep: true,
  sections: ["Nombres complexes"],
  generator: (nb: number) =>
    getDistinctQuestions(getLinearCombinaisonComplexQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
};
