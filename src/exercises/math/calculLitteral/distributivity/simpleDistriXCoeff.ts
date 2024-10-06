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
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  GetGGBOptions,
  GetStudentGGBOptions,
  GetGGBAnswer,
  RebuildIdentifiers,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine } from "#root/math/polynomials/affine";
import { Trinom, TrinomConstructor } from "#root/math/polynomials/trinom";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { parseLatex } from "#root/tree/parsers/latexParser";
import { alignTex } from "#root/utils/latex/alignTex";

//ax(bx+c)
type Identifiers = {
  a: number;
  b: number;
  c: number;
};

const buildFromIdentifiers = (identifiers: Identifiers) => {};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const affine = new Affine(a, 0);
  const affine2 = new Affine(b, c);
  tryToAddWrongProp(propositions, affine.add(affine2).toTree().toTex());
  tryToAddWrongProp(propositions, new Trinom(a * b, 0, c).toTree().toTex());
  tryToAddWrongProp(
    propositions,
    affine.multiply(affine2.opposite()).toTree().toTex(),
  );

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      TrinomConstructor.random(
        undefined,
        {
          min: 0,
          max: 1,
        },
        undefined,
      )
        .toTree()
        .toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const affine = new Affine(identifiers.a, 0);
  const affine2 = new Affine(identifiers.b, identifiers.c);
  return affine.multiply(affine2).toTree().toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const affine = new Affine(identifiers.a, 0);
  const affine2 = new Affine(identifiers.b, identifiers.c);
  const statement = new MultiplyNode(affine.toTree(), affine2.toTree());
  return `Développer et réduire : 
  
$$
${statement.toTex()}
$$
  `;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  const affine = new Affine(identifiers.a, 0);

  return `Multiplie chaque terme dans la parenthèse par $${affine
    .toTree()
    .toTex()}$.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const affine = new Affine(identifiers.a, 0).toTree();
  const affine2 = new Affine(identifiers.b, identifiers.c).toTree();
  const statement = new MultiplyNode(affine, affine2);
  const answer = getAnswer(identifiers);
  return `${alignTex([
    [
      statement.toTex(),
      "=",
      new AddNode(
        new MultiplyNode(affine, new Affine(identifiers.b, 0).toTree(), {
          forceTimesSign: true,
        }),
        new MultiplyNode(affine, new NumberNode(identifiers.c), {
          forceTimesSign: true,
        }),
      ).toTex(),
    ],
    ["", "=", answer],
  ])}`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["x"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, a, b, c }) => {
  const affine = new Affine(a, 0);
  const affine2 = new Affine(b, c);
  const ansTree = affine.multiply(affine2).toTree();
  return ansTree.toAllValidTexs().includes(ans);
};

const getSimpleDistriXCoeffQuestion: QuestionGenerator<Identifiers> = () => {
  const a = randint(-10, 11, [0]);
  const b = randint(-10, 11, [0]);
  const c = randint(-10, 11, [0]);

  const identifiers: Identifiers = { a, b, c };
  const question: Question<Identifiers> = {
    answer: getAnswer(identifiers),
    instruction: getInstruction(identifiers),
    keys: getKeys(identifiers),
    answerFormat: "tex",
    identifiers,
    hint: getHint(identifiers),
    correction: getCorrection(identifiers),
  };

  return question;
};

export const simpleDistriXCoeff: Exercise<Identifiers> = {
  id: "simpleDistriXCoeff",
  connector: "=",
  label: "Distributivité du type $ax(bx+c)$",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getSimpleDistriXCoeffQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  ggbTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
