import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode, SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { alignTex } from "#root/utils/alignTex";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";
type Identifiers = {
  a: number;
  b: number;
};

const getFactoType1Question: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(
    {
      min: 1,
      max: 10,
    },
    { min: -9, max: 0 },
  );

  const statementTree = affine.multiply(affine).toTree();
  const statementTex = statementTree.toTex();
  const answerTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answer = answerTree.toTex();
  const aMonom = new Affine(affine.a, 0).toTree();
  const question: Question<Identifiers> = {
    instruction: `Factoriser : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.a, b: affine.b },
    hint: `Essaie de réécrire cette expression sous la forme 
    
$$
a^2 - 2ab+b^2
$$`,
    correction: `
On utilise l'identité remarquable 

$$
a^2 - 2ab+b^2 = (a-b)^2
$$ 

en prenant $a=${aMonom.toTex()}$ et $b=${-affine.b}$ : 

${alignTex([
  [
    statementTex,
    "=",
    new AddNode(
      new SubstractNode(
        new SquareNode(aMonom),
        new MultiplyNode(
          (2).toTree(),
          new MultiplyNode(aMonom, (-affine.b).toTree()),
        ),
      ),
      new SquareNode((-affine.b).toTree()),
    ).toTex(),
  ],
  ["", "=", answer],
])}
`,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new PowerNode(new Affine(-b, -a).toTree(), new NumberNode(2)).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new PowerNode(new Affine(-a, b).toTree(), new NumberNode(2)).toTex(),
  );

  while (propositions.length < n) {
    const wrongAnswer = new PowerNode(
      new Affine(a + randint(-a + 1, 10 - a), b + randint(-9 - b, -b)).toTree(),
      new NumberNode(2),
    );
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const affine = new Affine(a, b);
  const answerTree = new SquareNode(affine.toTree());
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const factoIdRmq2: Exercise<Identifiers> = {
  id: "factoIdRmq2",
  connector: "=",
  isSingleStep: false,
  label: "Factorisation du type $a^2 - 2ab + b^2$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
