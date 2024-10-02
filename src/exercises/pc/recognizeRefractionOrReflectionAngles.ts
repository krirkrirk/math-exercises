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
import { blueMain, orangeDark } from "#root/geogebra/colors";
import { GeogebraConstructor } from "#root/geogebra/geogebraConstructor";
import { randint } from "#root/math/utils/random/randint";
import { random } from "#root/utils/random";

type Identifiers = {};

const IsAsking = {
  RefractionAngle: "Angle de réfraction",
  ReflectionAngle: "Angle de réflexion",
  IncidenceAngle: "Angle d'incidence",
};
const questionAngle = [
  IsAsking.ReflectionAngle,
  IsAsking.IncidenceAngle,
  IsAsking.RefractionAngle,
];

const getRecognizeRefractionOrReflectionAnglesQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.isAsking,
    instruction: `Un rayon arrive sur la surface de séparation entre deux milieux. Comment appelle-t-on l'angle représenté ci-dessous ?`,
    keys: [],
    ggbOptions: exo.ggb.getOptions({
      coords: exo.coords,
    }),
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Angle d'incidence", "raw");
  tryToAddWrongProp(propositions, "Angle de réfraction", "raw");
  tryToAddWrongProp(propositions, "Angle de réflexion", "raw");
  return shuffleProps(propositions, n);
};

const generateExercise = () => {
  const enetringLight = { x1: randint(-20, -10), y1: randint(15, 21) };
  const reflectionLight = { x2: -enetringLight.x1, y2: enetringLight.y1 };
  const refractingLight = {
    x2: reflectionLight.x2 - randint(5, 10),
    y2: -reflectionLight.y2,
  };
  const isAsking = random(questionAngle);
  const angle = getAngle(isAsking, enetringLight);
  const commands = [
    `E = Vector((${enetringLight.x1},${enetringLight.y1}), (0,0))`,
    `R = Vector((0,0), (${reflectionLight.x2},${reflectionLight.y2}))`,
    `I = Vector((0,0), (${refractingLight.x2},${refractingLight.y2}))`,
    angle!,
    `DashedLine = Line((0,0),(0,5))`,
    `Y = Line((0,0),(5,0))`,
    `Text("\\tiny \\text{Surface de séparation}", (-12,0),false,true)`,
    `Text("\\tiny \\text{Milieu 1}", (9,2.5),false,true)`,
    `Text("\\tiny \\text{Milieu 2}", (9,0),false,true)`,
    `YText = Text(RotateText("\\tiny \\text{Rayon incident}",-90°+${getAngle(
      IsAsking.IncidenceAngle,
      enetringLight,
    ).substring(6)}), (${enetringLight.x1 / 2 - 1.5},${
      enetringLight.y1 / 2
    }),false,true)`,
    `SetLineStyle(DashedLine,2)`,
    `ShowLabel(Ang,false)`,
    `SetColor(E,"#F78D04")`,
    `SetColor(R,"#F78D04")`,
    `SetColor(I,"#F78D04")`,
    `SetColor(YText,"${orangeDark}")`,
    `SetFixed(E,true)`,
    `SetFixed(R,true)`,
    `SetFixed(I,true)`,
    `SetFixed(DashedLine,true)`,
    `SetFixed(Y,true)`,
    `First = Polygon((15, 0), (15,12), (-15, 12), (-15, 0))`,
    `Second = Polygon((15, 0), (15,-12), (-15, -12), (-15, 0))`,
    `SetColor(First,"${blueMain}")`,
    `SetColor(Second,"#0a6a01")`,
    `SetColor(Ang,"#6a0101")`,
  ];
  const ggb = new GeogebraConstructor({
    commands,
    hideGrid: true,
    hideAxes: true,
  });

  const coords = [-10, 10, -10, 10];

  return {
    enetringLight,
    reflectionLight,
    commands,
    coords,
    ggb,
    isAsking,
  };
};

const getAngle = (
  isAsking: any,
  enetringLight: any = { x1: 0, y1: 0 },
): string => {
  switch (isAsking) {
    case IsAsking.RefractionAngle:
      return `Ang = Angle(Vector((0,0), (0,-5)),I)`;
    case IsAsking.ReflectionAngle:
      return `Ang = Angle(R,Vector((0,0), (0,5)))`;
    case IsAsking.IncidenceAngle:
      return `Ang = Angle(Line((0,0), (0,5)),Line((0,0),(${enetringLight.x1},${enetringLight.y1})))`;
    default:
      return "";
  }
};
export const recognizeRefractionOrReflectionAngles: Exercise<Identifiers> = {
  id: "recognizeRefractionOrReflectionAngles",
  label: "Reconaitre un anlge de reflexion, de refraction ou d'incidence",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Lumière"],
  generator: (nb: number) =>
    getDistinctQuestions(getRecognizeRefractionOrReflectionAnglesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  answerType: "QCU",
  subject: "Physique",
  hasGeogebra: true,
};
