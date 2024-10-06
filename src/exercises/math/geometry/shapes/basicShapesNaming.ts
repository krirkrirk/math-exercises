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
import { LineConstructor } from "#root/math/geometry/line";
import { PointConstructor } from "#root/math/geometry/point";
import { RayConstructor } from "#root/math/geometry/ray";
import { SegmentConstructor } from "#root/math/geometry/segment";
import { randint } from "#root/math/utils/random/randint";
import { isSegmentName } from "#root/tree/parsers/isSegmentName";
import { KeyId } from "#root/types/keyIds";

type Identifiers = { type: number; commands: string[] };

//!!Difficile de rendre cet exo non pur QCM car taper la parenthèse ouvre un environnement left/right ce qui empeche de taper des demi droites [AB)
//!solutions que je vois :
//! créer une touche parenthèse qui n'ouvre pas left/right (faisable mais relou)
//! créer des touches [..], (..) et [..) directement (mais il faut déplacer le curseur vers la gauche dans ce cas)
const getBasicShapesNamingQuestion: QuestionGenerator<Identifiers> = () => {
  let answer = "";
  const commands: string[] = [];
  const type = randint(1, 4);
  let startPointName = "";
  switch (type) {
    case 1: //segment
      const segment = SegmentConstructor.random();
      commands.push(...segment.toGGBCommands(true));
      answer = segment.name;
      break;
    case 2: //demi-droite
      const ray = RayConstructor.random();
      commands.push(...ray.toGGBCommands(true));
      answer = ray.name;
      startPointName = ray.startPoint.name;
      break;
    case 3: //droite
    default:
      const line = LineConstructor.random();
      commands.push(...line.toGGBCommands(true));
      answer = line.toTexNoLeftRight();
      break;
  }

  const ggb = new GeogebraConstructor({
    commands,
    hideAxes: true,
    hideGrid: true,
  });
  const letters = answer.substring(1, answer.length - 1).split("") as KeyId[];
  // console.log(letters);
  const question: Question<Identifiers> = {
    answer,
    instruction: `Comment se nomme la figure suivante ?`,
    keys: ["lbracket", "rbracket", ...letters],

    answerFormat: "tex",
    identifiers: { type, commands },
    ggbOptions: ggb.getOptions({
      coords: [-15, 15, -15, 15],
    }),
    keyboardOptions: {
      parenthesisShouldNotProduceLeftRight: true,
    },
    hint: `On rappelle que : 
    
- Une longueur se note $AB$ ;
- Un segment se note $[AB]$ ;
- Une demi-droite d'origine $A$ se note $[AB)$ ;
- Une droite se note $(AB)$.
`,
    correction: `La figure tracée est ${
      type === 1
        ? "un segment"
        : type === 2
        ? `une demi-droite d'origine $${startPointName}$`
        : "une droite"
    }.
    
Cette figure se nomme donc $${answer}$.`,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const name = answer
    .replace("(", "")
    .replace("[", "")
    .replace("]", "")
    .replace(")", "");
  tryToAddWrongProp(propositions, "[" + name + "]");
  tryToAddWrongProp(propositions, "[" + name + ")");
  tryToAddWrongProp(propositions, "(" + name + ")");
  tryToAddWrongProp(propositions, name);
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { type, answer }) => {
  const reversedAnswer = answer[0] + answer[2] + answer[1] + answer[3];
  if (type === 2) return ans === answer;
  else {
    return ans === answer || ans === reversedAnswer;
  }
};

export const basicShapesNaming: Exercise<Identifiers> = {
  id: "basicShapesNaming",
  connector: "=",
  label: "Nommer un segment/une demi-droite/une droite",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getBasicShapesNamingQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasGeogebra: true,
  hasHintAndCorrection: true,
};
