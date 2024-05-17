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
import { time } from "console";

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
];

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
  const question: Question<Identifiers> = {
    answer: randint(1, 10) + "",
    instruction: `test${randint(1, 100)}`,
    keys: [],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: [-5, maxCoord + 5, -5, maxCoord + 5],
    answerFormat: "tex",
    identifiers: { triangleSides: triangle.sides },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    throw Error("QCM not implemented");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  throw Error("VEA not implemented");
};

const generateTriangle = () => {
  const generateRightTriangle: boolean = coinFlip();
  if (generateRightTriangle) {
    const randomRectTriangle = random(pythagoreTriplet);
    return {
      ggbCommands: [
        `A=Point({0,0})`,
        `B=Point({${randomRectTriangle[1]},0})`,
        `C=Point({0,${randomRectTriangle[2]}})`,
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
        `SetColor(C,"Black")`,
        `Poly=Polygon(A,B,C)`,
      ],
      sides: {
        ABSide: triangle[0],
        ACSide: triangle[1],
        BCSide: triangle[2],
      },
    };
  }
};

const getCloseRightTriangle = (bC: number): { aB: number; aC: number } => {
  for (let aB = 2; aB <= bC / 2; aB++) {
    for (let aC = aB; aC <= bC - 1; aC++) {
      const result = Math.pow(aB, 2) + Math.pow(aC, 2);
      const bCPowTwo = Math.pow(bC, 2);
      if (
        result >= bCPowTwo - 4 &&
        result <= bCPowTwo + 4 &&
        result !== bCPowTwo
      )
        return { aB, aC };
    }
  }
  return { aB: 0, aC: 0 };
};

export const isTriangleRight: Exercise<Identifiers> = {
  id: "isTriangleRight",
  label: "",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getIsTriangleRightQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
