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
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { ClosureType, IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { UnionIntervalNode } from "#root/tree/nodes/sets/unionIntervalNode";
import { coinFlip } from "#root/utils/coinFlip";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  a: number;
  coin: number;
  racine1: number;
  racine2: number;
};

const getThirdDegreeFunctionVariation: QuestionGenerator<Identifiers> = () => {
  const a = randint(-3, 4, [0]);
  const c = randint(-2, 3);
  const racine1 = randint(-5, 4);
  const racine2 = randint(racine1 + 1, 6);

  const coefs: number[] = [
    c,
    a * racine1 * racine2,
    (-a * (racine1 + racine2)) / 2,
    a / 3,
  ];
  const polynome = new Polynomial(coefs);

  const coin = coinFlip() ? -1 : 1;

  const instruction =
    `Soit $f$ la fonction représentée ci-dessous. Sur quel intervalle la dérivée de $f$ est-elle ` +
    (coin < 0 ? "négative ?" : "positive ?");
  const answer =
    coin * a < 0
      ? `[${racine1};${racine2}]`
      : `]-\\infty;${racine1}]\\cup[${racine2};+\\infty[`;

  const commands = [polynome.toString()];

  const ymax = Math.max(
    polynome.calculate(racine1),
    polynome.calculate(racine2),
  );
  const ymin = Math.min(
    polynome.calculate(racine1),
    polynome.calculate(racine2),
  );

  const question: Question<Identifiers> = {
    instruction,
    startStatement: "S",
    answer,
    keys: ["lbracket", "rbracket", "semicolon", "infty"],
    answerFormat: "tex",

    coords: [
      racine1 - (randint(7, 20) / 10) * (racine2 - racine1),
      racine2 + (randint(7, 20) / 10) * (racine2 - racine1),
      ymin - ((ymax - ymin) * randint(7, 20)) / 10,
      ymax + ((ymax - ymin) * randint(7, 20)) / 10,
    ],
    commands,
    identifiers: { racine1, racine2, coin, a },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, racine1, racine2 },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(propositions, `[${racine2};+\\infty[`);
  tryToAddWrongProp(propositions, `]-\\infty;${racine1}]`);
  tryToAddWrongProp(
    propositions,
    `]-\\infty;${racine1}]\\cup[${racine2};+\\infty[`,
  );

  while (propositions.length < n) {
    const racine1 = randint(-5, 4);
    const racine2 = randint(racine1 + 1, 6);
    const wrongAnswer = `[${racine1};${racine2}]`;
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { racine1, racine2, coin, a },
) => {
  const r1 = new NumberNode(racine1);
  const r2 = new NumberNode(racine2);
  const answer =
    coin * a < 0
      ? new IntervalNode(r1, r2, ClosureType.FF)
      : new UnionIntervalNode([
          new IntervalNode(MinusInfinityNode, r1, ClosureType.OF),
          new IntervalNode(r2, PlusInfinityNode, ClosureType.FO),
        ]);

  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const thirdDegreeFunctionVariation: MathExercise<Identifiers> = {
  id: "thirdDegreeFunctionVariation",
  connector: "=",
  label: "Lecture du signe de la dérivée via les variations d'une fonction",
  levels: [
    "1reESM",
    "1reSpé",
    "1reTech",
    "MathComp",
    "1rePro",
    "TermPro",
    "TermTech",
  ],
  sections: ["Dérivation"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getThirdDegreeFunctionVariation, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,

  isAnswerValid,
};
