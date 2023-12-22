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

const getRightTriangleArea: QuestionGenerator<QCMProps, VEAProps> = () => {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomRightTriangle({
    minRapport: 0.4,
    maxRapport: 1.6,
    names: vertices,
  });

  const sidesLength = [
    Math.round(triangle.getSideBnumber() / 2),
    Math.round(triangle.getSideCnumber() / 2),
  ];

  const commands = [
    ...triangle.generateCommands({
      showLabels: [triangle.getSideBName(), triangle.getSideCName()],
      setCaptions: [sidesLength[0] + "", sidesLength[1] + ""],
    }),
  ];

  const answer = ((sidesLength[0] * sidesLength[1]) / 2 + "").replace(".", ",");
  const question: Question<QCMProps, VEAProps> = {
    instruction: `Calculer l'aire du triangle $${triangle.getTriangleName()}$ rectangle en ${triangle.getRightAngle()} sachant que $${triangle.getSideBName()} = ${
      sidesLength[0]
    }$ cm et $${triangle.getSideCName()} = ${sidesLength[1]}$ cm.`,
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

export const rightTriangleArea: MathExercise<QCMProps, VEAProps> = {
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
};
