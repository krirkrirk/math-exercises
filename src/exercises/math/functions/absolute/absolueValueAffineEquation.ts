import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  GetAnswer,
  GetHint,
  GetCorrection,
  GetInstruction,
  GetKeys,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Integer } from "#root/math/numbers/integer/integer";
import { NombreConstructor, NumberType } from "#root/math/numbers/nombre";
import { RationalConstructor } from "#root/math/numbers/rationals/rational";
import {
  GeneralAffine,
  GeneralAffineConstructor,
  GeneralAffineIdentifiers,
} from "#root/math/polynomials/generalAffine";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { equal } from "#root/tree/nodes/equations/equalNode";
import { AbsNode, abs } from "#root/tree/nodes/functions/absNode";
import { rationalParser } from "#root/tree/parsers/rationalParser";

type Identifiers = {
  firstAffine: GeneralAffineIdentifiers;
  secondAffine: GeneralAffineIdentifiers;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const fracs = [
      RationalConstructor.randomIrreductibleWithSign().toTree(),
      RationalConstructor.randomIrreductibleWithSign().toTree(),
    ].sort((a, b) => a.evaluate() - b.evaluate());
    tryToAddWrongProp(
      propositions,
      `x=${fracs[0].toTex()}\\text{ ou }${fracs[1].toTex()}`,
    );
  }
  return shuffleProps(propositions, n);
};

const getAnswerNode = (identifiers: Identifiers) => {
  const affines = [
    GeneralAffineConstructor.fromIdentifiers(identifiers.firstAffine),
    GeneralAffineConstructor.fromIdentifiers(identifiers.secondAffine),
  ];
  const firstIntersec = affines[0].xIntersect(affines[1]);
  const oppositeAffine = affines[1].opposite();
  const secondIntersec = oppositeAffine.xIntersect(affines[0]);
  const res = [firstIntersec, secondIntersec]
    .filter(Boolean)
    .sort((a, b) => a!.evaluate() - b!.evaluate());
  return res as AlgebraicNode[];
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  const nodes = getAnswerNode(identifiers);
  if (nodes.length > 1)
    return `x=${nodes[0].toTex()}\\text{ ou }x=${nodes[1].toTex()}`;
  return `x=${nodes[0]?.toTex() || nodes[1]?.toTex()}`;
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const affines = [
    GeneralAffineConstructor.fromIdentifiers(identifiers.firstAffine),
    GeneralAffineConstructor.fromIdentifiers(identifiers.secondAffine),
  ];
  const node = equal(abs(affines[0].toTree()), abs(affines[1].toTree()));
  return `Résoudre : 
  
$$
${node.toTex()}
$$`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `L'égalité $|a|=|b|$ est vraie si et seulement si $a = b$ ou $a = -b$.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const affines = [
    GeneralAffineConstructor.fromIdentifiers(identifiers.firstAffine),
    GeneralAffineConstructor.fromIdentifiers(identifiers.secondAffine),
  ];
  const firstIntersec = affines[0].xIntersect(affines[1]);
  const oppositeAffine = affines[1].opposite();
  const secondIntersec = oppositeAffine.xIntersect(affines[0]);
  const res = [firstIntersec, secondIntersec]
    .filter(Boolean)
    .sort((a, b) => a!.evaluate() - b!.evaluate()) as AlgebraicNode[];

  return `L'égalité $|a|=|b|$ est vraie si et seulement si $a = b$ ou $a=-b$.
  
On doit donc résoudre deux équations: d'une part,

$$
${affines[0].toTree().toTex()} = ${affines[1].toTree().toTex()}
$$

${
  firstIntersec
    ? `ce qui donne : 
  
  $$
  x=${firstIntersec?.toTex()}
  $$`
    : "qui n'a pas de solution, "
}

et d'autre part :

$$
${affines[0].toTree().toTex()} = ${oppositeAffine.toTree().toTex()}
$$

${
  secondIntersec
    ? `ce qui donne : 
  
$$
x=${secondIntersec?.toTex()}
$$`
    : "qui n'a pas de solution."
}


Ainsi, la solution de cette équation est :

$$
${
  res.length > 1
    ? `x=${res[0].toTex()} \\text{ ou } x=${res[1].toTex()}`
    : `x=${res[0]?.toTex() || res[1]?.toTex()}`
}
`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return ["x", "equal", "ou"];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer, ...identifiers }) => {
  const parsedOu = ans.split("\\text{ ou }");
  console.log(parsedOu);
  try {
    const nodes: AlgebraicNode[] = [];
    parsedOu.forEach((item) => {
      let formated = item
        .replaceAll("\\text{", "")
        .replaceAll("}", "")
        .replaceAll(" ", "");
      const equalForm = formated.split("=");
      if (equalForm.length > 1 && equalForm[0] !== "x")
        throw Error("wrong answer");
      const nbStr = equalForm.length > 1 ? equalForm[1] : formated;
      const node = rationalParser(nbStr);
      if (!node) throw Error("wrong answer");
      nodes.push(node);
    });
    const answerNodes = getAnswerNode(identifiers);
    return answerNodes.every((e) =>
      nodes.some((n) => n.evaluate() === e.evaluate()),
    );
  } catch (err) {
    return false;
  }
};

const getAbsolueValueAffineEquationQuestion: QuestionGenerator<Identifiers> = (
  ops,
) => {
  const types = [NumberType.Integer];
  const [a, c] = NombreConstructor.manyRandom(4, {
    types,
    excludes: [new Integer(0)],
  }).map((e) => e.toTree());
  const [b, d] = NombreConstructor.manyRandom(4, {
    types,
  }).map((e) => e.toTree());

  const identifiers: Identifiers = {
    firstAffine: new GeneralAffine(a, b).toIdentifiers(),
    secondAffine: new GeneralAffine(c, d).toIdentifiers(),
  };
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

export const absolueValueAffineEquation: Exercise<Identifiers> = {
  id: "absolueValueAffineEquation",
  connector: "\\iff",
  label: "Résoudre une équation avec valeur absolue du type $|ax+b|=|cx+d|$",
  isSingleStep: false,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getAbsolueValueAffineEquationQuestion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
};
