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
import { random } from "#root/utils/random";

type Identifiers = {};

const IsAsking = {
  RefractionAngle: "Angle de refraction",
  ReflectionAngle: "Angle de reflexion",
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
    instruction: `À quoi correspend l'angle coloré en vert ?`,
    keys: [],
    commands: exo.ggb.commands,
    coords: exo.coords,
    options: exo.ggb.getOptions(),
    answerFormat: "raw",
    identifiers: {},
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "Angle d'incidence", "raw");
  tryToAddWrongProp(propositions, "Angle de refraction", "raw");
  tryToAddWrongProp(propositions, "Angle de reflexion", "raw");
  return shuffleProps(propositions, n);
};

const generateExercise = () => {
  const enetringLight = { x1: randint(-10, -5), y1: randint(5, 11) };
  const reflectionLight = { x2: -enetringLight.x1, y2: enetringLight.y1 };
  const refractingLight = {
    x2: reflectionLight.x2 - randint(2, reflectionLight.x2),
    y2: -reflectionLight.y2,
  };
  const isAsking = random(questionAngle);
  const angle = getAngle(isAsking, enetringLight);
  const commands = [
    `E = Vector((${enetringLight.x1 - 20},${enetringLight.y1 + 20}), (0,0))`,
    `R = Vector((0,0), (${reflectionLight.x2 + 20},${
      reflectionLight.y2 + 20
    }))`,
    `I = Vector((0,0), (${refractingLight.x2 + 20},${
      refractingLight.y2 - 20
    }))`,
    `DashedLine = Line((0,0),(0,5))`,
    `Y = Line((0,0),(5,0))`,
    `SetLineStyle(DashedLine,2)`,
    angle!,
    `ShowLabel(Ang,false)`,
    `SetColor(E,"#F78D04")`,
    `SetColor(R,"#F78D04")`,
    `SetColor(I,"#F78D04")`,
    `SetFixed(E,true)`,
    `SetFixed(R,true)`,
    `SetFixed(I,true)`,
    `SetFixed(DashedLine,true)`,
    `SetFixed(Y,true)`,
  ];
  const ggb = new GeogebraConstructor(commands, {
    hideGrid: true,
    hideAxes: true,
  });

  const coords = [
    enetringLight.x1,
    reflectionLight.x2,
    enetringLight.x1,
    reflectionLight.x2,
  ];

  return {
    enetringLight,
    reflectionLight,
    commands,
    coords,
    ggb,
    isAsking,
  };
};

const getAngle = (isAsking: any, enetringLight: any) => {
  switch (isAsking) {
    case IsAsking.RefractionAngle:
      return `Ang = Angle(Vector((0,0), (0,-5)),I)`;
    case IsAsking.ReflectionAngle:
      return `Ang = Angle(R,Vector((0,0), (0,5)))`;
    case IsAsking.IncidenceAngle:
      return `Ang = Angle(Line((0,0), (0,5)),Line((0,0),(${enetringLight.x1},${enetringLight.y1})))`;
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
  answerType: "QCM",
  subject: "Physique",
};
