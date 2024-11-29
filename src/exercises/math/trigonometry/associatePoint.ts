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
import { RemarkableValueConstructor } from "#root/math/trigonometry/remarkableValue";
import { NodeIdentifiers } from "#root/tree/nodes/nodeConstructor";
import { KeyId } from "#root/types/keyIds";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  angleValue: number;
  angleIdentifiers: NodeIdentifiers;
  point: string;
};

const points: KeyId[] = [
  "I",
  "A",
  "B",
  "C",
  "J",
  "D",
  "E",
  "F",
  "G",
  "H",
  "K",
  "L",
  "M",
  "N",
  "P",
  "Q",
];
const getAssociatePointQuestion: QuestionGenerator<Identifiers> = () => {
  const remarkableValue = RemarkableValueConstructor.simplifiable();

  const answer = remarkableValue.point;
  const question: Question<Identifiers> = {
    answer,
    instruction: `À quel point du cercle trigonométrique ci-dessous le réel $${remarkableValue.angle.toTex()}$ est-il associé ?
    ![](https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/mathliveV2/activities/quizzes/generator/piCircle.png)
    `,
    keys: points,
    answerFormat: "tex",
    identifiers: {
      angleValue: remarkableValue.mainAngle.evaluate({}),
      point: answer,
      angleIdentifiers: remarkableValue.angle.toIdentifiers(),
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, angleValue },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    const rand = random(points);
    tryToAddWrongProp(propositions, rand);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return answer === ans;
};
export const associatePoint: Exercise<Identifiers> = {
  id: "associatePoint",
  connector: "=",
  label: "Associer un réel à un point du cercle trigonométrique",
  levels: ["1reSpé", "TermSpé"],
  isSingleStep: true,
  sections: ["Trigonométrie"],
  generator: (nb: number) =>
    getDistinctQuestions(getAssociatePointQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
