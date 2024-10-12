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
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  sidesLengths: number[];
};

const getRightTriangleArea: QuestionGenerator<Identifiers> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({
    minRapport: 0.4,
    maxRapport: 1.6,
    names: vertices,
  });

  const sidesLengths = [
    Math.round(triangle.getSideBnumber() / 2),
    Math.round(triangle.getSideCnumber() / 2),
  ];

  const commands = [
    ...triangle.generateCommands({
      showLabels: [triangle.getSideBName(), triangle.getSideCName()],
      setCaptions: [sidesLengths[0] + "", sidesLengths[1] + ""],
    }),
  ];

  const answer = ((sidesLengths[0] * sidesLengths[1]) / 2 + "").replace(
    ".",
    ",",
  );
  const answerTex = answer + "\\text{cm}^2";
  const ggb = new GeogebraConstructor({
    commands,
    hideAxes: true,
    hideGrid: true,
  });
  const question: Question<Identifiers> = {
    instruction: `Calculer l'aire du triangle $${triangle.getTriangleName()}$ rectangle en ${triangle.getRightAngle()} sachant que $${triangle.getSideBName()} = ${
      sidesLengths[0]
    }$ cm et $${triangle.getSideCName()} = ${sidesLengths[1]}$ cm.`,
    answer: answerTex,
    keys: ["cm", "cm2"],
    ggbOptions: ggb.getOptions({
      coords: triangle.generateCoords(),
    }),
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

export const rightTriangleArea: Exercise<Identifiers> = {
  id: "rightTriangleArea",
  connector: "=",
  label: "Calculer l'aire d'un triangle rectangle",
  levels: ["4ème", "3ème", "2nde"],
  isSingleStep: false,
  sections: ["Aires", "Géométrie euclidienne"],
  generator: (nb: number) => getDistinctQuestions(getRightTriangleArea, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Mathématiques",
};
