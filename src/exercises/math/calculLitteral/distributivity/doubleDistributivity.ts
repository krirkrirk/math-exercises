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
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";
import { alignTex } from "#root/utils/latex/alignTex";
import { shuffle } from "#root/utils/alea/shuffle";
type Identifiers = {
  affine1Coeffs: number[];
  affine2Coeffs: number[];
};

const getDoubleDistributivityQuestion: QuestionGenerator<Identifiers> = () => {
  const affines = AffineConstructor.differentRandoms(2, undefined, {
    excludes: [0],
  });

  const statementTree = new MultiplyNode(
    affines[0].toTree(),
    affines[1].toTree(),
  );
  const answer = affines[0].multiply(affines[1]).toTree().toTex();

  const subTerms = [
    new MultiplyNode(affines[0].a.toTree(), "x".toTree()),
    affines[0].b.toTree(),
    new MultiplyNode(affines[1].a.toTree(), "x".toTree()),
    affines[1].b.toTree(),
  ];
  const subMultiplications = [
    new MultiplyNode(subTerms[0], subTerms[2], { forceTimesSign: true }),
    new MultiplyNode(subTerms[0], subTerms[3], { forceTimesSign: true }),
    new MultiplyNode(subTerms[1], subTerms[2], { forceTimesSign: true }),
    new MultiplyNode(subTerms[1], subTerms[3], { forceTimesSign: true }),
  ];
  const statementTex = statementTree.toTex();
  const question: Question<Identifiers> = {
    instruction: `Développer et réduire : $${statementTex}$`,
    startStatement: statementTree.toTex(),
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: {
      affine1Coeffs: affines[0].coefficients,
      affine2Coeffs: affines[1].coefficients,
    },
    hint: "Multiplie chaque terme du premier facteur par chaque terme du second facteur, puis regroupe les termes similaires.",
    correction: `
${alignTex([
  [statementTex, "=", operatorComposition(AddNode, subMultiplications).toTex()],
  [
    "",
    "=",
    operatorComposition(
      AddNode,
      subMultiplications.map((e) => e.simplify()),
    ).toTex(),
  ],
  ["", "=", answer],
])}

    `,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, affine1Coeffs, affine2Coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affines = [
    new Affine(affine1Coeffs[1], affine1Coeffs[0]),
    new Affine(affine2Coeffs[1], affine2Coeffs[0]),
  ];
  tryToAddWrongProp(
    propositions,
    affines[0]
      .multiply(new Affine(-affines[1].a, randint(-9, 10, [affines[1].b])))
      .toTree()
      .toTex(),
  );

  tryToAddWrongProp(
    propositions,
    affines[1]
      .multiply(new Affine(randint(-9, 10, [affines[0].a, 0]), affines[0].b))
      .toTree()
      .toTex(),
  );

  while (propositions.length < n) {
    const affinesTemps = AffineConstructor.differentRandoms(2, undefined, {
      excludes: [0],
    });
    const wrongAnswer = affinesTemps[0].multiply(affinesTemps[1]).toTree();
    tryToAddWrongProp(propositions, wrongAnswer.toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { affine1Coeffs, affine2Coeffs },
) => {
  const affines = [
    new Affine(affine1Coeffs[1], affine1Coeffs[0]),
    new Affine(affine2Coeffs[1], affine2Coeffs[0]),
  ];
  const answerTree = affines[0].multiply(affines[1]).toTree();
  const validLatexs = answerTree.toAllValidTexs();
  return validLatexs.includes(ans);
};

export const doubleDistributivity: Exercise<Identifiers> = {
  id: "doubleDistri",
  connector: "=",
  label: "Distributivité double",
  levels: ["3ème", "2nde", "1reTech"],
  sections: ["Calcul littéral"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getDoubleDistributivityQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
