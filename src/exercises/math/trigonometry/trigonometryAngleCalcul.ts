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
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { TriangleConstructor } from "#root/math/geometry/triangles";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { KeyId } from "#root/types/keyIds";
import { shuffle } from "#root/utils/shuffle";
import { v4 } from "uuid";

type Identifiers = {
  sideLengths: number[];
  randAngle: number;
  randSides: number[];
};

const getTrigonometryAngleCalcul: QuestionGenerator<Identifiers> = () => {
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
  const randSides = shuffle([0, 1, 2]);

  const answer =
    randAngle === 0
      ? Math.round((Math.acos(sideLengths[0] / sideLengths[2]) * 180) / Math.PI)
      : Math.round(
          (Math.acos(sideLengths[1] / sideLengths[2]) * 180) / Math.PI,
        );
  const answerTex = answer + "^{\\circ}";
  const ggb = new GeogebraConstructor(
    triangle.generateCommands({ highlightedAngle: angle[randAngle] }),
    {
      hideAxes: true,
      hideGrid: true,
    },
  );
  const question: Question<Identifiers> = {
    instruction: `Le triangle $${triangle.getTriangleName()}$ rectangle en $${triangle.getRightAngle()}$ est tel que $${
      sides[randSides[0]]
    } = ${(sideLengths[randSides[0]] + "").replace(".", ",")}$ cm et $${
      sides[randSides[1]]
    } = ${(sideLengths[randSides[1]] + "").replace(
      ".",
      ",",
    )}$ cm. Calculer $\\widehat{${angle[randAngle]}}$ à $1^\\circ$ près.`,
    answer: answerTex,
    keys: ["degree"],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: triangle.generateCoords(),
    answerFormat: "tex",
    identifiers: { randAngle, sideLengths, randSides },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(20, 80) + "°");
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.split("^")[0]].includes(ans);
};
export const trigonometryAngleCalcul: Exercise<Identifiers> = {
  id: "trigonometryAngleCalcul",
  connector: "=",
  label: "Utiliser la trigonométrie pour calculer un angle",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Trigonométrie", "Géométrie euclidienne"],
  generator: (nb: number) =>
    getDistinctQuestions(getTrigonometryAngleCalcul, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
