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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { TriangleConstructor } from "#root/math/geometry/triangles";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { KeyId } from "#root/types/keyIds";
import { shuffle } from "#root/utils/shuffle";
type Identifiers = {
  sideLengths: number[];
  randAngle: number;
  randSide: number;
  randSideQuestion: number;
};

const getTrigonometrySideCalcul: QuestionGenerator<Identifiers> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({
    minRapport: 0.5,
    maxRapport: 1.5,
    names: vertices,
  });

  const sides = [
    triangle.getSideCName(),
    triangle.getSideBName(),
    triangle.getSideAName(),
  ];

  const sideLengths = [
    triangle.getSideCnumber(),
    triangle.getSideBnumber(),
    triangle.getSideAnumber(),
  ].map((el) => round(el / 2, 2));

  const angle = [triangle.vertexB.name, triangle.vertexC.name];

  const randAngle = randint(0, 2);
  const randSide = randint(0, 3); // valeurs possible : 0 1 2
  const randSideQuestion = randint(0, 3, [randSide]); // si rand = 0, valeurs possible 1 2

  const angleValue = [
    round((Math.acos(sideLengths[0] / sideLengths[2]) * 180) / Math.PI, 1),
    round((Math.acos(sideLengths[1] / sideLengths[2]) * 180) / Math.PI, 1),
  ];

  const commands = [
    ...triangle.generateCommands({
      highlightedAngle: angle[randAngle],
      colorHighlightedAngle: "Black",
      showLabels: [sides[randSideQuestion]],
      setCaptions: ["?"],
      highlightedSide: sides[randSideQuestion],
    }),
  ];
  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
  });
  const answer = `${(round(sideLengths[randSideQuestion], 1) + "").replace(
    ".",
    ",",
  )}`;
  const question: Question<Identifiers> = {
    instruction: `Le triangle $${triangle.getTriangleName()}$ rectangle en $${triangle.getRightAngle()}$ est tel que $${
      sides[randSide]
    } = ${(sideLengths[randSide] + "").replace(".", ",")}$ cm et $\\widehat{${
      angle[randAngle]
    }} = ${(angleValue[randAngle] + "").replace(".", ",")}^\\circ$. Calculer $${
      sides[randSideQuestion]
    }$ à $0,1$ cm près.`,
    answer,
    keys: [],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: triangle.generateCoords(),
    answerFormat: "tex",
    identifiers: { randAngle, randSide, randSideQuestion, sideLengths },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `${(round(randint(11, 100) / 10, 1) + "").replace(".", ",")}`,
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const answerTree = new NumberNode(Number(answer.replace(",", ".")));
  const texs = answerTree.toAllValidTexs();
  return texs.includes(ans);
};

export const trigonometrySideCalcul: MathExercise<Identifiers> = {
  id: "trigonometrySideCalcul",
  connector: "=",
  label: "Utiliser la trigonométrie pour calculer un côté",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Trigonométrie", "Géométrie euclidienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getTrigonometrySideCalcul, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
};
