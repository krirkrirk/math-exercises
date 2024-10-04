import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { Line, LineConstructor } from "#root/math/geometry/line";
import { PointConstructor } from "#root/math/geometry/point";
import { RayConstructor } from "#root/math/geometry/ray";
import { Segment, SegmentConstructor } from "#root/math/geometry/segment";
import { randint } from "#root/math/utils/random/randint";
import { randomLetter } from "#root/utils/strings/randomLetter";

type Identifiers = { type: number; commands: string[] };

const getBasicShapesRecognitionQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let answer = "";
  const commands: string[] = [];
  const type = randint(0, 4);
  switch (type) {
    case 0: //point
      answer = "Un point";
      const point = PointConstructor.random(randomLetter(true));
      commands.push(...point.toGGBCommand());
      break;
    case 1: //segment
      answer = "Un segment";
      const segment = SegmentConstructor.random();
      commands.push(...segment.toGGBCommands(true));
      break;
    case 2: //demi-droite
      answer = "Une demi-droite";
      const ray = RayConstructor.random();
      commands.push(...ray.toGGBCommands(true));
      break;
    case 3: //droite
    default:
      answer = "Une droite";
      const line = LineConstructor.random();
      commands.push(...line.toGGBCommands(true));
      break;
  }

  const ggb = new GeogebraConstructor({
    commands,
    hideAxes: true,
    hideGrid: true,
  });

  const question: Question<Identifiers> = {
    answer,
    instruction: `Quel est le type d'objet tracé ci-dessous ?`,
    keys: [],
    answerFormat: "raw",
    identifiers: { type, commands },
    ggbOptions: ggb.getOptions({
      coords: [-15, 15, -15, 15],
    }),
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Un point", "raw");
  tryToAddWrongProp(propositions, "Une droite", "raw");
  tryToAddWrongProp(propositions, "Un segment", "raw");
  tryToAddWrongProp(propositions, "Une demi-droite", "raw");

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const basicShapesRecognition: Exercise<Identifiers> = {
  id: "basicShapesRecognition",
  connector: "=",
  label: "Reconnaître un point / un segment / une demi-droite / une droite",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getBasicShapesRecognitionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  answerType: "QCU",
};
