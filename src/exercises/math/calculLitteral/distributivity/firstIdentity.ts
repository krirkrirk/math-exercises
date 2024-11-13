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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode, SquareNode } from "#root/tree/nodes/operators/powerNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  a: number;
  b: number;
};

export const getFirstIdentityQuestion: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(
    {
      min: 1,
      max: 11,
    },
    {
      min: 1,
      max: 11,
    },
  );

  const statementTree = new PowerNode(affine.toTree(), new NumberNode(2));
  const answer = affine.multiply(affine).toTree().toTex();

  const aMonom = new MultiplyNode(affine.a.toTree(), "x".toTree());

  const statementTex = statementTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Développer et réduire : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { a: affine.a, b: affine.b },
    hint: `Utilise l'identité remarquable 
    
$$
(a+b)^2 = a^2 + 2ab+b^2
$$ 

en prenant $a=${aMonom.toTex()}$ et $b=${affine.b}$`,
    correction: `
On utilise l'identité remarquable :

$$
(a+b)^2 = a^2 + 2ab+b^2
$$ 

en prenant $a=${aMonom.toTex()}$ et $b=${affine.b}$.

${alignTex([
  [
    statementTex,
    "=",
    new AddNode(
      new AddNode(
        new SquareNode(aMonom),
        new MultiplyNode(
          (2).toTree(),
          new MultiplyNode(aMonom, affine.b.toTree()),
        ),
      ),
      new SquareNode(affine.b.toTree()),
    ).toTex(),
  ],
  ["", "=", answer],
])}
`,
  };
  return question;
};

export const getFirstIdentityPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Polynomial([b ** 2, 0, a ** 2]).toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new Polynomial([b ** 2, a * b, a ** 2]).toTree().toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new Polynomial([b ** 2, a ** 2 + b ** 2, a ** 2]).toTree().toTex(),
  );

  const affine = new Affine(a, b);
  while (propositions.length < n) {
    const affineTemp = AffineConstructor.random(
      {
        excludes: [0],
      },
      {
        excludes: [0],
      },
    );
    const wrongAnswer = affine.multiply(affineTemp).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

export const isFirstIdentityAnswerValid: VEA<Identifiers> = (ans, { a, b }) => {
  const affine = new Affine(a, b);
  const answer = affine.multiply(affine).toTree();
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};

const tests = () => {
  //si identifiers = x,y alors questions devrait etre x,y et vea devrait accepter x,y,z
};

export const firstIdentity: Exercise<Identifiers> = {
  id: "idRmq1",
  connector: "=",
  label: "Identité remarquable $(a+b)^2$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getFirstIdentityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions: getFirstIdentityPropositions,
  isAnswerValid: isFirstIdentityAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
