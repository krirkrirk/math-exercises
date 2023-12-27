/**
 *  type (ax+b)(cx+d) ± (ax+b)(ex+f)
 */

import {
  MathExercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { random } from "#root/utils/random";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  affinesCoeffs: number[][];
  operation: string;
};

const getFactoType1Question: QuestionGenerator<Identifiers> = () => {
  const affines = AffineConstructor.differentRandoms(3);

  const permut: Affine[][] = [
    shuffle([affines[0], affines[1]]),
    shuffle([affines[0], affines[2]]),
  ];

  const operation = random(["add", "substract"]);

  const statementTree =
    operation === "add"
      ? new AddNode(
          new MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()),
          new MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree()),
        )
      : new SubstractNode(
          new MultiplyNode(permut[0][0].toTree(), permut[0][1].toTree()),
          new MultiplyNode(permut[1][0].toTree(), permut[1][1].toTree()),
        );

  const affine1 = affines[0];
  const affine2 = affines[1].add(
    operation === "add" ? affines[2] : affines[2].opposite(),
  );

  const answerTree =
    affine2.coefficients[0] === 0
      ? affine1.coefficients[0] === 0
        ? affine1.multiply(affine2).toTree()
        : new MultiplyNode(affine2.toTree(), affine1.toTree())
      : new MultiplyNode(affine1.toTree(), affine2.toTree());
  const answer = answerTree.toTex();

  const question: Question<Identifiers> = {
    instruction: `Factoriser : $${statementTree.toTex()}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: {
      affinesCoeffs: affines.map((affine) => affine.coefficients),
      operation,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, affinesCoeffs, operation },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affines = affinesCoeffs.map(
    (coeffs) => new Affine(coeffs[1], coeffs[0]),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      affines[0].toTree(),
      affines[1]
        .add(operation !== "add" ? affines[2] : affines[2].opposite())
        .toTree(),
    ).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      affines[1].toTree(),
      affines[0]
        .add(operation === "add" ? affines[2] : affines[2].opposite())
        .toTree(),
    ).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(
      affines[2].toTree(),
      affines[0]
        .add(operation === "add" ? affines[2] : affines[2].opposite())
        .toTree(),
    ).toTex(),
  );

  while (propositions.length < n) {
    const wrongAnswer = new MultiplyNode(
      affines[0].toTree(),
      affines[1].add(AffineConstructor.differentRandoms(1)[0]).toTree(),
    );

    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { affinesCoeffs, operation }) => {
  const affines = affinesCoeffs.map(
    (coeffs) => new Affine(coeffs[1], coeffs[0]),
  );

  const affine1 = affines[0];
  const affine2 = affines[1].add(
    operation === "add" ? affines[2] : affines[2].opposite(),
  );

  const answerTree =
    affine2.coefficients[0] === 0
      ? affine1.coefficients[0] === 0
        ? affine1.multiply(affine2).toTree()
        : new MultiplyNode(affine2.toTree(), affine1.toTree())
      : new MultiplyNode(affine1.toTree(), affine2.toTree());
  const answer = answerTree.toTex();
  const validLatexs = answerTree.toAllValidTexs();
  console.log(ans, validLatexs);
  return validLatexs.includes(ans);
};

export const factoType1Exercise: MathExercise<Identifiers> = {
  id: "facto1",
  connector: "=",
  isSingleStep: false,
  label: "Factorisation du type $(ax+b)(cx+d) \\pm (ax+b)(ex+f)$",
  levels: ["3ème", "2nde"],
  sections: ["Calcul littéral"],
  generator: (nb: number) => getDistinctQuestions(getFactoType1Question, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
