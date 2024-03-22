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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { KeyId } from "#root/types/keyIds";
import { randomLetter } from "#root/utils/randomLetter";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {};

const getTriangleArea: QuestionGenerator<Identifiers> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomTriangle({
    minAngle: 0.69,
    maxAngle: 1.5,
    names: vertices,
  });

  const sides = [
    triangle.getSideAName(),
    triangle.getSideBName(),
    triangle.getSideCName(),
  ];
  const sidesLengths = [
    triangle.getSideAnumber(),
    triangle.getSideBnumber(),
    triangle.getSideCnumber(),
  ].map((el) => Math.round(el / 2));
  const angles = [
    triangle.getAngleA(),
    triangle.getAngleB(),
    triangle.getAngleC(),
  ];

  const randoms = shuffle([0, 1, 2]);

  const height = Math.round(
    sidesLengths[randoms[1]] * Math.sin(angles[randoms[2]]),
  );
  const interceptName = randomLetter(true, vertices);
  const commands = [
    ...triangle.generateCommands({
      showLabels: [sides[randoms[0]]],
      setCaptions: [sidesLengths[randoms[0]] + ""],
    }),
    `poi = Intersect(PerpendicularLine(${vertices[randoms[0]]},${
      sides[randoms[0]]
    }),${sides[randoms[0]]})`,
    `SetCaption(poi, "${interceptName}")`,
    `ShowLabel(poi, true)`,
    `seg = Segment(${vertices[randoms[0]]}, poi)`,
    `ShowLabel(seg, true)`,
    `SetCaption(seg, "${height}")`,
    `SetLineStyle(seg, 1)`,
    `alpha = Angle(${vertices[randoms[0]]},poi ,${vertices[randoms[1]]}, Line(${
      vertices[randoms[0]]
    },poi))`,
    `ShowLabel(alpha, false)`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    hideAxes: true,
    hideGrid: true,
  });
  const answer = ((sidesLengths[randoms[0]] * height) / 2 + "").replace(
    ".",
    ",",
  );
  const answerTex = answer + "\\text{cm}^2";
  const question: Question<Identifiers> = {
    instruction: `Calculer l'aire du triangle $${triangle.getTriangleName()}$ sachant que $${
      sides[randoms[0]]
    } = ${sidesLengths[randoms[0]]}$ cm et $${
      vertices[randoms[0]]
    }${interceptName} = ${height}$ cm.`,
    answer: answerTex,
    keys: ["cm", "cm2"],
    commands: ggb.commands,
    options: ggb.getOptions(),
    coords: triangle.generateCoords(),
    answerFormat: "tex",
    identifiers: { sidesLengths },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      ((randint(2, 12) * randint(2, 12)) / 2 + "\\text{cm}^2").replace(
        ".",
        ",",
      ),
    );
  }

  return shuffle(propositions);
};
const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  const double = Number(answer.split("\\text")[0].replace(",", ".")) * 2;
  const area = new Rational(double, 2)
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const numberTexs = area.toAllValidTexs();
  const texs = [
    ...numberTexs,
    ...numberTexs.map((tex) => tex + "\\text{cm}^2"),
  ];
  return texs.includes(ans);
};
export const triangleArea: Exercise<Identifiers> = {
  id: "triangleArea",
  connector: "=",
  label: "Calculer l'aire d'un triangle (avec figure)",
  levels: ["5ème", "4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Aires", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getTriangleArea, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
