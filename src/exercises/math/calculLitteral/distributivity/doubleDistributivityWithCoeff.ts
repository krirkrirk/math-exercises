import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
  GetHint,
  GetCorrection,
  GetAnswer,
  GetInstruction,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { alignTex } from "#root/utils/latex/alignTex";

type Identifiers = {
  coeff: number;
  affine1: number[];
  affine2: number[];
};

const getHint: GetHint<Identifiers> = ({ coeff, affine1, affine2 }) => {
  return `Choisis deux facteurs de ce produit et multiplie les entre eux. Puis, multiplier le résultat obtenu par le troisième terme.`;
};

const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const affine1 = new Affine(identifiers.affine1[1], identifiers.affine1[0]);
  const affine2 = new Affine(identifiers.affine2[1], identifiers.affine2[0]);
  const affine3 = affine1.times(identifiers.coeff);

  const statement = new MultiplyNode(
    new MultiplyNode(identifiers.coeff.toTree(), affine1.toTree()),
    affine2.toTree(),
  ).toTex();

  return `On commence par multiplier les deux premiers termes entre eux : 
    
${alignTex(
  `${statement} = ${new MultiplyNode(
    affine1.times(identifiers.coeff).toTree(),
    affine2.toTree(),
  ).toTex()}`,
)}

Puis, on utilise la double distributivité : 

${alignTex([
  ["", "", new MultiplyNode(affine3.toTree(), affine2.toTree()).toTex()],
  [
    "",
    "=",
    new AddNode(
      new MultiplyNode(
        new Affine(affine3.a, 0).toTree(),
        new Affine(affine2.a, 0).toTree(),
        { forceTimesSign: true },
      ),
      new AddNode(
        new MultiplyNode(
          new Affine(affine3.a, 0).toTree(),
          affine2.b.toTree(),
          { forceTimesSign: true },
        ),
        new AddNode(
          new MultiplyNode(
            affine3.b.toTree(),
            new Affine(affine2.a, 0).toTree(),
            { forceTimesSign: true },
          ),
          new MultiplyNode(affine3.b.toTree(), affine2.b.toTree(), {
            forceTimesSign: true,
          }),
        ),
      ),
    ).toTex(),
  ],
  ["", "=", getAnswer(identifiers)],
])}
    `;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const affine1 = new Affine(identifiers.affine1[1], identifiers.affine1[0]);
  const affine2 = new Affine(identifiers.affine2[1], identifiers.affine2[0]);
  const statement = new MultiplyNode(
    new MultiplyNode(identifiers.coeff.toTree(), affine1.toTree()),
    affine2.toTree(),
  ).toTex();
  return `Développer et réduire : $${statement}$`;
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const affine1 = new Affine(identifiers.affine1[1], identifiers.affine1[0]);
  const affine2 = new Affine(identifiers.affine2[1], identifiers.affine2[0]);
  const affine3 = affine1.times(identifiers.coeff);

  const answer = affine3.multiply(affine2).toTree().toTex();
  return answer;
};
const getDoubleDistributivityWithCoeffQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const coeff = randint(-10, 11, [-1, 0, 1]);
  const affine1 = AffineConstructor.random(undefined, {
    excludes: [0],
  });
  const affine2 = AffineConstructor.random(undefined, {
    excludes: [0],
  });

  const identifiers = {
    coeff,
    affine1: affine1.coefficients,
    affine2: affine2.coefficients,
  };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: ["x"],
    answerFormat: "tex",
    identifiers: identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      TrinomConstructor.random(
        { min: -100, max: 100 },
        { min: -100, max: 100 },
        { min: -100, max: 100 },
      )
        .toTree()
        .toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, affine1, affine2, coeff },
) => {
  const affine1Obj = AffineConstructor.fromCoeffs(affine1);
  const affine2Obj = AffineConstructor.fromCoeffs(affine2);
  const answerTree = affine1Obj.times(coeff).multiply(affine2Obj).toTree();
  return answerTree.toAllValidTexs().includes(ans);
};

const isGGBAnswerValid: GGBVEA<Identifiers> = (ans, { ggbAnswer }) => {
  throw Error("GGBVea not implemented");
};
export const doubleDistributivityWithCoeff: Exercise<Identifiers> = {
  id: "doubleDistributivityWithCoeff",
  connector: "=",
  label: "Développer une expression du type $a(bx+c)(dx+e)$",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getDoubleDistributivityWithCoeffQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  isGGBAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
  getHint,
  getCorrection,
  getAnswer,
  getInstruction,
};
