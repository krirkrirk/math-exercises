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
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { roundSignificant } from "#root/math/utils/round";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { random } from "#root/utils/alea/random";

type Identifiers = {
  length: number;
  forceValue: number;
  angleDegree: number;
};

const getForceWorkQuestion: QuestionGenerator<Identifiers> = () => {
  const length = randint(1, 10);
  const forceValue = randint(1, 10);
  const angle = random(
    remarkableTrigoValues.filter((v) => v.degree > 0 && v.degree < 180),
  );

  const answer = new MultiplyNode(
    length.toTree(),
    new MultiplyNode(angle.cos, forceValue.toTree()),
  ).evaluate({});

  const rounded = roundSignificant(answer, 1);
  const question: Question<Identifiers> = {
    answer: rounded + "J",
    instruction: `Soit une force $\\overrightarrow F$ constante dont le point d'application se déplace d'une position $A$ à une position $B$ telle que $F = ${roundSignificant(
      forceValue,
      1,
    )}\\ \\text{N}$, $AB = ${roundSignificant(
      length,
      1,
    )}\\ \\text{m}$ et $\\widehat{\\left(\\overrightarrow F ; \\overrightarrow{AB}\\right)} = ${
      angle.degree
    }^{\\circ}$. Calculer le travail de la force $\\overrightarrow F$ lors du déplacement de $A$ vers $B$.`,
    keys: ["J", "timesTenPower"],
    answerFormat: "tex",
    identifiers: { length, forceValue, angleDegree: angle.degree },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, angleDegree, forceValue, length },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      roundSignificant(randfloat(-30, 30, 1), 1) + "J",
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [answer, answer.replace("J", "")].includes(ans);
};
export const forceWork: Exercise<Identifiers> = {
  id: "forceWork",
  connector: "=",
  label: "Calculer le travail d'une force",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Forces"],
  generator: (nb: number) => getDistinctQuestions(getForceWorkQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
