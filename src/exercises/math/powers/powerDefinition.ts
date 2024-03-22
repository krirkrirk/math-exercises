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
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";

type Identifiers = {
  int: number;
  power: number;
};

const getPowerDefinitionQuestion: QuestionGenerator<Identifiers> = () => {
  const int = randint(2, 11);
  const power = randint(2, 6);
  let statement = "";
  for (let i = 0; i < power; i++) {
    statement += int + "";
    if (i < power - 1) statement += "\\times";
  }
  const answer = new PowerNode(
    new NumberNode(int),
    new NumberNode(power),
  ).toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Écrire sous forme de puissance : $${statement}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { int, power },
  };

  return question;
};
const isAnswerValid: VEA<Identifiers> = (ans, { int, power }) => {
  const answer = new PowerNode(
    new NumberNode(int),
    new NumberNode(power),
  ).toTex();
  return ans === answer;
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, int, power },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, `${power}\\times${int}`);
  tryToAddWrongProp(propositions, `${int}\\times${power}`);

  while (propositions.length < n) {
    const wrongAnswer = new PowerNode(
      new NumberNode(int),
      new NumberNode(randint(2, 7)),
    ).toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

export const powerDefinition: Exercise<Identifiers> = {
  id: "powerDefinition",
  connector: "=",
  label: "Écrire un produit sous forme de puissance",
  levels: ["4ème", "3ème", "2ndPro", "CAP"],
  isSingleStep: true,
  sections: ["Puissances"],
  generator: (nb: number) =>
    getDistinctQuestions(getPowerDefinitionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
