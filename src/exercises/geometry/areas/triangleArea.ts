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
import { TriangleConstructor } from "#root/math/geometry/triangles";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { KeyId } from "#root/types/keyIds";
import { shuffle } from "#root/utils/shuffle";

type QCMProps = {
  answer: string;
};
type VEAProps = {
  answer: string;
};

const getTriangleArea: QuestionGenerator<QCMProps, VEAProps> = () => {
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
  const sidesLength = [
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
    sidesLength[randoms[1]] * Math.sin(angles[randoms[2]]),
  );

  const commands = [
    ...triangle.generateCommands({
      showLabels: [sides[randoms[0]]],
      setCaptions: [sidesLength[randoms[0]] + ""],
    }),
    `poi = Intersect(PerpendicularLine(${vertices[randoms[0]]},${
      sides[randoms[0]]
    }),${sides[randoms[0]]})`,
    `ShowLabel(poi, true)`,
    `SetCaption(poi, "${String.fromCharCode(code + 3)}")`,
    `seg = Segment(${vertices[randoms[0]]}, poi)`,
    `ShowLabel(seg, true)`,
    `SetCaption(seg, "${height}")`,
    `SetLineStyle(seg, 1)`,
    `alpha = Angle(${vertices[randoms[0]]},poi ,${vertices[randoms[1]]}, Line(${
      vertices[randoms[0]]
    },poi))`,
    `ShowLabel(alpha, false)`,
  ];

  const answer = ((sidesLength[randoms[0]] * height) / 2 + "").replace(
    ".",
    ",",
  );
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire du triangle $${triangle.getTriangleName()}$ sachant que $${
      sides[randoms[0]]
    } = ${sidesLength[randoms[0]]}$ cm et $${
      vertices[randoms[0]]
    }${String.fromCharCode(code + 3)} = ${height}$ cm.`,
    answer: answer + "\\text{cm}^2",
    keys: ["cm", "cm2"],
    commands,
    coords: triangle.generateCoords(),
    answerFormat: "tex",
    qcmGeneratorProps: { answer },
  };

  return question;
};

const getPropositions: QCMGenerator<QCMProps> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer + "\\text{cm}^2");
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
const isAnswerValid: VEA<VEAProps> = (ans, { answer }) => {
  const double = Number(answer.replace(",", ".")) * 2;
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
export const triangleArea: MathExercise<QCMProps, VEAProps> = {
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
};
