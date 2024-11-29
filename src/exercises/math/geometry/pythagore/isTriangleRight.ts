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
import { Triangle } from "#root/math/geometry/triangle";
import { pythagoricianTriplets } from "#root/math/utils/geometry/pythagoricianTriplets";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { random } from "#root/utils/alea/random";
import { doWhile } from "#root/utils/doWhile";
import { alignTex } from "#root/utils/latex/alignTex";
import { randomLetter } from "#root/utils/strings/randomLetter";

type Identifiers = {
  isRight: boolean;
  a: number;
  b: number;
  c: number;
  vertices: string[];
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Oui", "raw");
  tryToAddWrongProp(propositions, "Non", "raw");
  tryToAddWrongProp(propositions, "On ne peut pas savoir", "raw");
  return shuffleProps(propositions, n);
};

const getAnswer: GetAnswer<Identifiers> = (identifiers) => {
  return identifiers.isRight ? "Oui" : "Non";
};

const getInstruction: GetInstruction<Identifiers> = (identifiers) => {
  const triangleName = identifiers.vertices.join("");
  const sides = identifiers.vertices.map(
    (vertex, index) => vertex + identifiers.vertices[(index + 1) % 3],
  );
  return `Soit $${triangleName}$ un triangle avec $${
    sides[0]
  } = ${identifiers.a.frenchify()}$, $${
    sides[1]
  } = ${identifiers.b.frenchify()}$ et $${
    sides[2]
  } = ${identifiers.c.frenchify()}$. Le triangle $${triangleName}$ est-il rectangle ?`;
};

const getHint: GetHint<Identifiers> = (identifiers) => {
  return `Si la somme des carrés des côtés est égale au carré de l'hypoténuse, alors le triangle est rectangle, d'après la réciproque du théorème de Pythagore. Si ce n'est pas le cas, alors le triangle n'est pas rectangle, d'après le théorème de Pythagore. L'hypoténuse est toujours le côté le plus grand dans un triangle.`;
};
const getCorrection: GetCorrection<Identifiers> = (identifiers) => {
  const hypo = Math.max(identifiers.a, identifiers.b, identifiers.c);
  const sides = [identifiers.a, identifiers.b, identifiers.c].filter(
    (e) => e !== hypo,
  );
  return `La somme des carrés des côtés est égale à : 
  
${alignTex([
  [
    new AddNode(
      new SquareNode(sides[0].toTree()),
      new SquareNode(sides[1].toTree()),
    ).toTex(),
    "=",
    round(sides[0] ** 2, 6).frenchify() +
      "+" +
      round(sides[1] ** 2, 6).frenchify(),
  ],
  ["", "=", round(sides[0] ** 2 + sides[1] ** 2, 6).frenchify()],
])}

Le carré de l'hypoténuse vaut : 

$$
${new SquareNode(hypo.toTree()).toTex()} = ${round(hypo ** 2, 6).frenchify()}
$$

${
  identifiers.isRight
    ? "La somme des carrés des côtés est donc égale au carré de l'hypoténuse. D'après la réciproque du théorème de Pythagore, le triangle est donc rectangle."
    : "La somme des carrés des côtés n'est donc pas égale au carré de l'hypoténuse. D'après le théorème de Pythagore, le triangle n'est donc pas rectangle."
}`;
};

const getKeys: GetKeys<Identifiers> = (identifiers) => {
  return [];
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const getIsTriangleRightQuestion: QuestionGenerator<Identifiers> = () => {
  const isRight = coinFlip();
  const startVertix = randomLetter(true, ["Y", "Z"]);
  const vertices = [
    startVertix,
    String.fromCharCode(startVertix.charCodeAt(0) + 1),
    String.fromCharCode(startVertix.charCodeAt(0) + 2),
  ];
  const triplet = random(pythagoricianTriplets);
  const coeff = random([1, 2, 3, 4, 0.1, 0.2, 0.4, 0.5]);
  let [a, b, c] = triplet.map((e) => round(e * coeff, 4));
  if (!isRight) {
    c = doWhile(
      () => round(coeff * (triplet[2] + random([-1, 1])), 4),
      (x) => x === a || x === b,
    );
  }

  const identifiers: Identifiers = { isRight, vertices, a, b, c };
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

export const isTriangleRight: Exercise<Identifiers> = {
  id: "isTriangleRight",
  connector: "\\iff",
  label: "Déterminer si un triangle est rectangle via Pythagore",
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getIsTriangleRightQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getHint,
  getCorrection,
  getAnswer,
  hasHintAndCorrection: true,
  answerType: "QCU",
};
