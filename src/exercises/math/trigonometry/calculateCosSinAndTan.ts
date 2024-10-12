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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { CosNode } from "#root/tree/nodes/functions/cosNode";
import { SinNode } from "#root/tree/nodes/functions/sinNode";
import { TanNode } from "#root/tree/nodes/functions/tanNode";
import { DegreeNode } from "#root/tree/nodes/geometry/degree";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  degree: number;
  trigoFunct: string;
};

const trigo = ["sin", "tan", "cos"];

const getCalculateCosSinAndTanQuestion: QuestionGenerator<Identifiers> = () => {
  const trigoFunct = random(trigo);

  const degree = randint(1, 180);

  const question: Question<Identifiers> = {
    answer: getCorrectAnswer(degree, trigoFunct),
    instruction: `Calculer $\\${trigoFunct}(${new DegreeNode(
      degree,
    ).toTex()})$, arrondir le résultat au dixième.`,
    keys: [],
    answerFormat: "tex",
    identifiers: { degree, trigoFunct },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, degree }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const correctAns = Math.cos(degree);
  let random;
  while (propositions.length < n) {
    random = (+(correctAns + randfloat(-0.5, 0.6)).toFixed(2)).toTree();
    tryToAddWrongProp(propositions, random.toTex());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const getCorrectAnswer = (degree: number, trigoFunct: string): string => {
  let ans;
  switch (trigoFunct) {
    case "cos":
      const cos = new CosNode(degree.toTree());
      ans = +cos.evaluate({}).toFixed(2);
      return ans.toTree().toTex();
    case "sin":
      const sin = new SinNode(degree.toTree());
      ans = +sin.evaluate({}).toFixed(2);
      return ans.toTree().toTex();
    case "tan":
      const tan = new TanNode(degree.toTree());
      ans = +tan.evaluate({}).toFixed(2);
      return ans.toTree().toTex();
    default:
      return "";
  }
};

export const calculateCosSinAndTan: Exercise<Identifiers> = {
  id: "calculateCosSinAndTan",
  label: "Calculer le cosinus/sinus/tangente d'un angle en degrés",
  levels: ["3ème"],
  isSingleStep: true,
  sections: ["Trigonométrie"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateCosSinAndTanQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
