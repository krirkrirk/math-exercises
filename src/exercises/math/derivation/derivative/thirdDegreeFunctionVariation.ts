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
import { randomColor } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import {
  MinusInfinityNode,
  PlusInfinityNode,
} from "#root/tree/nodes/numbers/infiniteNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { ClosureType } from "#root/tree/nodes/sets/closure";
import { IntervalNode } from "#root/tree/nodes/sets/intervalNode";
import { UnionIntervalNode } from "#root/tree/nodes/sets/unionIntervalNode";
import { coinFlip } from "#root/utils/alea/coinFlip";
import { shuffle } from "#root/utils/alea/shuffle";
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
  const racine1Tree = new NumberNode(racine1);
  const racine2Tree = new NumberNode(racine2);
  const answer =
    coin * a < 0
      ? new IntervalNode(racine1Tree, racine2Tree, ClosureType.FF).toTex()
      : new UnionIntervalNode([
          new IntervalNode(MinusInfinityNode, racine1Tree, ClosureType.OF),
          new IntervalNode(racine2Tree, PlusInfinityNode, ClosureType.FO),
        ]).toTex();

  const commands = [
    `f(x) = ${polynome.toString()}`,
    `SetColor(f, "${randomColor()}")`,
  ];

  const y1 = polynome.calculate(racine1);
  const y2 = polynome.calculate(racine2);
  const yMax = Math.max(y1, y2);
  const yMin = Math.min(y1, y2);
  const xMax = Math.max(racine1, racine2);
  const xMin = Math.min(racine1, racine2);
  const ggb = new GeogebraConstructor({
    commands,
    lockedAxesRatio: false,
    gridDistance: false,
  });
  const question: Question<Identifiers> = {
    instruction,
    startStatement: "S",
    answer,
    keys: ["lbracket", "rbracket", "semicolon", "infty", "cup"],
    answerFormat: "tex",
    ggbOptions: ggb.getOptions({
      coords: ggb.getAdaptedCoords({ xMin, xMax, yMin, yMax }),
    }),
    identifiers: { racine1, racine2, coin, a },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, racine1, racine2 },
) => {
  const racine1Tree = new NumberNode(racine1);
  const racine2Tree = new NumberNode(racine2);
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new IntervalNode(racine2Tree, PlusInfinityNode, ClosureType.FO).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new IntervalNode(MinusInfinityNode, racine1Tree, ClosureType.OF).toTex(),
  );
  tryToAddWrongProp(
    propositions,
    new UnionIntervalNode([
      new IntervalNode(MinusInfinityNode, racine1Tree, ClosureType.OF),
      new IntervalNode(racine2Tree, PlusInfinityNode, ClosureType.FO),
    ]).toTex(),
  );

  while (propositions.length < n) {
    const root1 = randint(-5, 4);
    const root2 = randint(root1 + 1, 6);
    const root1Tree = new NumberNode(racine1);
    const root2Tree = new NumberNode(racine2);
    const wrongAnswer = new IntervalNode(
      root1Tree,
      root2Tree,
      ClosureType.FF,
    ).toTex();
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
  return texs.includes(ans);
};

export const thirdDegreeFunctionVariation: Exercise<Identifiers> = {
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
  hasGeogebra: true,
  subject: "Mathématiques",
};
