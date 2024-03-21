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
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randint } from "#root/math/utils/random/randint";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  affine1Coeffs: number[];
  affine2Coeffs: number[];
};
const getFactoType1Question: QuestionGenerator<Identifiers> = () => {
  const affine = AffineConstructor.random(
    {
      min: 1,
      max: 11,
    },
    { excludes: [0] },
  );
  const affine2 = new Affine(affine.a, -affine.b);

  const statementTree = affine.multiply(affine2).toTree();
  const answerTree = new MultiplyNode(affine.toTree(), affine2.toTree());
  const answer = answerTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Factoriser : $${statementTree.toTex()}$`,

    startStatement: statementTree.toTex(),
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: {
      affine1Coeffs: affine.coefficients,
      affine2Coeffs: affine2.coefficients,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, affine1Coeffs, affine2Coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(affine1Coeffs[1], affine1Coeffs[0]);
  const affine2 = new Affine(affine2Coeffs[1], affine2Coeffs[0]);

  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affine.toTree(), affine.toTree()).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affine.toTree(), affine.toTree()).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affine2.toTree(), affine2.toTree()).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      affine2.toTree(),
      new Affine(-affine.b, affine.a).toTree(),
    ).toTex(),
  );

  while (propositions.length < n) {
    const wrongAnswer = new MultiplyNode(
      new Affine(randint(-9, 10, [0]), randint(-9, 10, [0])).toTree(),
      new Affine(randint(-9, 10, [0]), randint(-9, 10, [0])).toTree(),
    );
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { affine1Coeffs, affine2Coeffs },
) => {
  const affine = new Affine(affine1Coeffs[1], affine1Coeffs[0]);
  const affine2 = new Affine(affine2Coeffs[1], affine2Coeffs[0]);
  const answerTree = new MultiplyNode(affine.toTree(), affine2.toTree());
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const factoIdRmq3: MathExercise<Identifiers> = {
  id: "factoIdRmq3",
  connector: "=",
  isSingleStep: false,
  label: "Factorisation du type $a^2 - b^2$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
