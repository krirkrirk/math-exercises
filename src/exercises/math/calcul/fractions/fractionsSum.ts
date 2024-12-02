import {
  Exercise,
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
  GetInstruction,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import {
  Rational,
  RationalConstructor,
} from "#root/math/numbers/rationals/rational";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { parseAlgebraic } from "#root/tree/parsers/latexParser";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  rational: number[];
  rational2: number[];
};

type Options = {
  allowNonIrreductible?: boolean;
};

const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  opts,
) => {
  const { rational, rational2 } = identifiers;
  const rationalObj = new Rational(rational[0], rational[1]);
  const rationalObj2 = new Rational(rational2[0], rational2[1]);
  const statementTree = new AddNode(
    rationalObj.toTree(),
    rationalObj2.toTree(),
  );
  return `Calculer ${
    opts?.allowNonIrreductible
      ? ""
      : "et donner le résultat sous la forme la plus simplifiée possible"
  } : 
    
$$
${statementTree.toTex()}
$$`;
};

const getFractionsSum: QuestionGenerator<Identifiers, Options> = (opts) => {
  const rational = RationalConstructor.randomIrreductible();
  const rational2 = RationalConstructor.randomIrreductible();
  const statementTree = new AddNode(rational.toTree(), rational2.toTree());
  const answerTree = rational.add(rational2).toTree();
  const answer = answerTree.toTex();
  const identifiers = {
    rational: [rational.num, rational.denum],
    rational2: [rational2.num, rational2.denum],
  };

  const question: Question<Identifiers, Options> = {
    instruction: getInstruction(identifiers, opts),
    startStatement: statementTree.toTex(),
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers,
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rational, rational2 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new Rational(
      rational[0] + rational2[0],
      rational[1] + rational2[1],
    ).toTex(),
  );

  while (propositions.length < n) {
    const incorrectRational = RationalConstructor.randomIrreductible();
    const incorrectRational2 = RationalConstructor.randomIrreductible();
    tryToAddWrongProp(
      propositions,
      incorrectRational.add(incorrectRational2).toTree().toTex(),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers, Options> = (
  ans,
  { rational, rational2 },
  opts,
) => {
  const rationalA = new Rational(rational[0], rational[1]);
  const rationalB = new Rational(rational2[0], rational2[1]);
  const allow = opts?.allowNonIrreductible;
  const answerTree = rationalA
    .add(rationalB)
    .toTree({ allowFractionToDecimal: true });

  const texs = answerTree.toAllValidTexs();
  if (allow)
    try {
      const parsed = rationalParser(ans);
      if (!parsed) return false;
      return texs.includes(parsed.simplify().toTex());
    } catch (err) {
      return false;
    }
  else return texs.includes(ans);
};

const options: GeneratorOption[] = [
  {
    id: "allowNonIrreductible",
    label: "Autoriser les fractions non réduites",
    type: GeneratorOptionType.checkbox,
    target: GeneratorOptionTarget.vea,
  },
];

export const fractionsSum: Exercise<Identifiers, Options> = {
  id: "fractionsSum",
  connector: "=",
  label: "Sommes de fractions",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro", "1rePro"],
  sections: ["Fractions"],
  isSingleStep: false,
  generator: (nb: number, opts?: Options) =>
    getDistinctQuestions(() => getFractionsSum(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  options,
  getInstruction,
};
