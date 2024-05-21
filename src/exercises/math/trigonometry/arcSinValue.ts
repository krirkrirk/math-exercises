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
import { randint } from "#root/math/utils/random/randint";
import { ArcsinNode } from "#root/tree/nodes/functions/arcSinNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { round } from "#root/math/utils/round";

type Identifiers = {
  arcsinValue: number;
  angleInDegrees: number;
  angleInRadians: number;
};

const getArcSinValueQuestion: QuestionGenerator<Identifiers> = () => {
  const angleInRadians = randint(-100, 100) / 100;
  const angleInDegrees = (angleInRadians * 180) / Math.PI;
  const arcsinValue = round(Math.asin(angleInRadians), 2);

  const instruction = `Quelle est la valeur en degrés de $\\theta$ si $\\arcsin(\\theta) = ${arcsinValue
    .toTree()
    .toTex()}$ ? Arrondir à l'unité.`;

  const answer = round(angleInDegrees, 0).toTree().toTex();

  const question: Question<Identifiers> = {
    answer: answer,
    instruction: instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { angleInRadians, arcsinValue, angleInDegrees },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, angleInDegrees },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongAnswer1 = Math.round(angleInDegrees + randint(-10, -1))
    .toTree()
    .toTex();
  const wrongAnswer2 = Math.round(angleInDegrees + randint(1, 10))
    .toTree()
    .toTex();
  const wrongAnswer3 = Math.round(angleInDegrees + randint(11, 20))
    .toTree()
    .toTex();
  const wrongAnswer4 = Math.round(angleInDegrees + randint(-20, -11))
    .toTree()
    .toTex();

  tryToAddWrongProp(propositions, wrongAnswer1);
  tryToAddWrongProp(propositions, wrongAnswer2);
  tryToAddWrongProp(propositions, wrongAnswer3);
  tryToAddWrongProp(propositions, wrongAnswer4);

  while (propositions.length < n) {
    const randomWrongAnswer = Math.round(randint(-90, 90)).toString();
    tryToAddWrongProp(propositions, randomWrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const arcSinValue: Exercise<Identifiers> = {
  id: "arcSinValue",
  label: "Calculer l'angle en degrés donné l'arcsin",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Trigonométrie"],
  generator: (nb: number) => getDistinctQuestions(getArcSinValueQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
