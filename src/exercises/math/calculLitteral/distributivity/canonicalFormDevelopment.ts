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
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine } from "#root/math/polynomials/affine";
import { TrinomConstructor } from "#root/math/polynomials/trinom";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { VariableNode } from "#root/tree/nodes/variables/variableNode";

type Identifiers = {
  coeffs: number[];
};

const getCanonicalFormDevelopmentQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const trinom = TrinomConstructor.randomCanonical();
  const answer = trinom.toTree().toTex();
  const cano = trinom.getCanonicalForm();
  const a = trinom.a;
  const alpha = trinom.getAlpha();
  const beta = trinom.getBeta();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Développer et réduire : $${cano.toTex()}$`,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: { coeffs: trinom.coefficients },
    hint: "Développe d'abord le terme qui est au carré en te servant d'une identité remarquable.",
    correction: `
$${cano.toTex()}$

$= ${new AddNode(
      new MultiplyNode(a.toTree(), new Affine(1, -alpha).square().toTree()),
      beta.toTree(),
    ).toTex()}$
    
$= ${answer}$
    `,
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
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, coeffs }) => {
  const trinom = TrinomConstructor.fromCoeffs(coeffs);
  return trinom.toTree().toAllValidTexs().includes(ans);
};

export const canonicalFormDevelopment: Exercise<Identifiers> = {
  id: "canonicalFormDevelopment",
  connector: "=",
  label: "Développer une forme canonique $a(x-\\alpha)^2 + \\beta$",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getCanonicalFormDevelopmentQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
