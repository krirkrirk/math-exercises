import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { coinFlip } from "#root/utils/coinFlip";
import { random } from "#root/utils/random";

type Identifiers = {
  triangleSides: TriangleSides;
};

type TriangleSides = {
  ABSide: number;
  ACSide: number;
  BCSide: number;
};

const pythagoreTriplet = [
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
  [12, 35, 37],
  [9, 40, 41],
  [28, 45, 53],
  [11, 60, 61],
  [16, 63, 65],
].map((value) => {
  return value.map((nb) => {
    return nb / 2;
  });
});

const almostRightTriangle = [
  [5, 1, 4.9],
  [5.1, 1, 5],
  [3.6, 2, 3],
  [7, 2, 6.7],
  [19, 2, 18.9],
  [20, 2, 19.9],
  [5, 3, 5.2],
  [11.4, 3, 11],
  [6.4, 4, 5],
  [13.6, 4, 13],
];
const getIsTriangleRightQuestion: QuestionGenerator<Identifiers> = () => {
  const triangle = generateTriangle();
  const ggb = new GeogebraConstructor(triangle.ggbCommands, {
    hideAxes: true,
    hideGrid: true,
    isGridSimple: true,
  });
  const maxCoord = Math.max(
    triangle.sides.ABSide,
    triangle.sides.ACSide,
    triangle.sides.BCSide,
  );

  const correctAnswer = triangle.isRight
    ? "Le triangle est rectangle en C."
    : "Le triangle n'est pas rectangle.";
  const question: Question<Identifiers> = {
    answer: correctAnswer,
    instruction: `Le triangle $ABC$ est-il rectangle, en sachant que : $AB=${triangle.sides.ABSide},AC=${triangle.sides.ACSide}$ et $BC=${triangle.sides.BCSide}$`,
    keys: [],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [-5, maxCoord + 5, -5, maxCoord + 5],
    answerFormat: "raw",
    identifiers: { triangleSides: triangle.sides },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Le triangle n'est pas rectangle.", "raw");
  tryToAddWrongProp(propositions, "Le triangle est rectangle en C.", "raw");
  tryToAddWrongProp(propositions, "on ne peut pas savoir.", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generateTriangle = () => {
  const generateRightTriangle: boolean = coinFlip();
  if (generateRightTriangle) {
    const randomRectTriangle = random(pythagoreTriplet);
    return {
      ggbCommands: [
        `C=Point({0,0})`,
        `A=Point({${randomRectTriangle[1]},0})`,
        `B=Point({0,${randomRectTriangle[2]}})`,
        `ShowLabel(A,True)`,
        `ShowLabel(B,True)`,
        `ShowLabel(C,True)`,
        `Poly=Polygon(A,B,C)`,
      ],
      sides: {
        ABSide: randomRectTriangle[0],
        ACSide: randomRectTriangle[1],
        BCSide: randomRectTriangle[2],
      },
      isRight: true,
    };
  } else {
    const triangle = random(almostRightTriangle);
    const aB = triangle[0];
    const aC = triangle[1];
    const bC = triangle[2];
    return {
      ggbCommands: [
        `A=Point({0,0})`,
        `B=Point({1,${aB}})`,
        `C=Point({Intersect(Circle(A,${aC}),Circle(B,${bC}))})`,
        `ShowLabel(B,True)`,
        `ShowLabel(A,True)`,
        `ShowLabel(C,True)`,
        `SetColor(A,"Black")`,
        `SetColor(B,"Black")`,
        `SetColor(C,"Black")`,
        `Poly=Polygon(A,B,C)`,
      ],
      sides: {
        ABSide: triangle[0],
        ACSide: triangle[1],
        BCSide: triangle[2],
      },
      isRight: false,
    };
  }
};

export const isTriangleRight: Exercise<Identifiers> = {
  id: "isTriangleRight",
  label:
    "Determiner si un triangle est rectangle à l'aide du theoreme de pythagore",
  levels: ["4ème"],
  isSingleStep: true,
  sections: ["Théorème de Pythagore"],
  generator: (nb: number) =>
    getDistinctQuestions(getIsTriangleRightQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  answerType: "QCM",
  hasGeogebra: true,
  subject: "Mathématiques",
};
