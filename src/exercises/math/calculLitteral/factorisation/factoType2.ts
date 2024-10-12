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
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Affine, AffineConstructor } from "#root/math/polynomials/affine";
import { randTupleInt } from "#root/math/utils/random/randTupleInt";
import { randint } from "#root/math/utils/random/randint";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { alignTex } from "#root/utils/latex/alignTex";
import { coinFlip } from "#root/utils/alea/coinFlip";

//(ax+b)(cx+d)+-(ax+b)
// a,c et d non null
// d !== 1 si b==0 pour éviter un monom en x^2

type Identifiers = {
  a: number;
  b: number;
  c: number;
  d: number;
  isSubstract: boolean;
};

const buildFromIdentifiers = (identifiers: Identifiers) => {};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, c, d, isSubstract },
) => {
  const propositions: Proposition[] = [];
  const affine1 = new Affine(a, b);
  const affine2 = new Affine(c, d);
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    getAnswer({ a, b, c, d, isSubstract: !isSubstract }),
  );
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(affine1.toTree(), affine2.toTree()).toTex(),
  );
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(
        affine1.toTree(),
        AffineConstructor.random().toTree(),
      ).toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswerTree = (identifiers: Identifiers) => {
  const affine1 = new Affine(identifiers.a, identifiers.b);
  const affine2 = new Affine(identifiers.c, identifiers.d);
  return new MultiplyNode(
    affine1.toTree(),
    affine2.add(identifiers.isSubstract ? -1 : 1).toTree(),
  );
};
const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return getAnswerTree(identifiers).toTex();
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const affine1 = new Affine(identifiers.a, identifiers.b);
  const affine2 = new Affine(identifiers.c, identifiers.d);
  const statement = new (identifiers.isSubstract ? SubstractNode : AddNode)(
    new MultiplyNode(affine1.toTree(), affine2.toTree()),
    affine1.toTree(),
  );
  return `Factoriser et réduire : 
  
$$
${statement.toTex()}
$$`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Repère d'abord le facteur commun dans cette expression. Puis, multiplie ce facteur commun par les autres termes de l'expression.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const affine1 = new Affine(identifiers.a, identifiers.b);
  const affine2 = new Affine(identifiers.c, identifiers.d);
  const answer = getAnswer(identifiers);
  const statement = new (identifiers.isSubstract ? SubstractNode : AddNode)(
    new MultiplyNode(affine1.toTree(), affine2.toTree()),
    affine1.toTree(),
  );

  const corr = `
${alignTex([
  ["", statement.toTex()],
  [
    "=",
    new AddNode(
      new MultiplyNode(affine1.toTree(), affine2.toTree()),
      new MultiplyNode(
        affine1.toTree(),
        identifiers.isSubstract ? (-1).toTree() : (1).toTree(),
      ),
    ).toTex(),
  ],
  [
    "=",
    new MultiplyNode(
      affine1.toTree(),
      new (identifiers.isSubstract ? SubstractNode : AddNode)(
        affine2.toTree(),
        (1).toTree(),
      ),
    ).toTex(),
  ],
  ["=", answer],
])}
  `;
  return corr;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["x"];
};
const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, a, b, c, d, isSubstract },
) => {
  const tree = getAnswerTree({ a, b, c, d, isSubstract });
  return ans === answer || tree.toAllValidTexs().includes(ans);
};

const getFactoType2Question: QuestionGenerator<Identifiers> = () => {
  const b = randint(-10, 11);
  const a = randint(-10, 11, [0]);
  const c = randint(-10, 11, [0]);
  const d = randint(-10, 11, b === 0 ? [0, -1] : [0]);
  const isSubstract = coinFlip();
  const identifiers: Identifiers = { a, b, c, d, isSubstract };
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

export const factoType2: Exercise<Identifiers> = {
  id: "factoType2",
  connector: "=",
  label:
    "Factorisation du type $\\left(ax+b\\right)\\left(cx+d\\right)\\pm\\left(ax+b\\right)$",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getFactoType2Question, nb),
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
