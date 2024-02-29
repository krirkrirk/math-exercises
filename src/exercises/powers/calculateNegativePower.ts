import {
  MathExercise,
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
import { Power } from "#root/math/numbers/integer/power";
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { v4 } from "uuid";
type Identifiers = {
  int: number;
  power: number;
};

const getCalculatePowerQuestion: QuestionGenerator<Identifiers> = () => {
  const int = randint(1, 11);
  const power = randint(-5, 0);
  const statement = new PowerNode(
    new NumberNode(int),
    new NumberNode(power),
  ).toTex();
  const answer = new Rational(1, int ** Math.abs(power))
    .simplify()
    .toTree()
    .toTex();

  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer : $${statement}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { int, power },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, int, power },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(propositions, int * power + "");
  tryToAddWrongProp(propositions, -(int ** Math.abs(power)) + "");
  tryToAddWrongProp(propositions, int * power + "");
  if (int === 1) {
    tryToAddWrongProp(propositions, power + "");
    tryToAddWrongProp(propositions, "0");
    tryToAddWrongProp(propositions, "1");
    tryToAddWrongProp(propositions, "-1");
    tryToAddWrongProp(propositions, "2");
    tryToAddWrongProp(propositions, -power + "");
  }
  while (propositions.length < n) {
    const wrongAnswer = new Rational(1, int ** randint(0, 6, [power]))
      .simplify()
      .toTree()
      .toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { int, power }) => {
  const answerTree = new Rational(1, int ** Math.abs(power))
    .simplify()
    .toTree({ allowFractionToDecimal: true });
  const secondTree = new FractionNode(
    new NumberNode(1),
    new Power(int, -power).simplify(),
  );
  const texs = [...answerTree.toAllValidTexs(), ...secondTree.toAllValidTexs()];
  console.log(texs);
  return texs.includes(ans);
};

export const calculateNegativePower: MathExercise<Identifiers> = {
  id: "calculateNegativePower",
  connector: "=",
  label: "Calculer une puissance négative",
  levels: ["4ème", "3ème", "2ndPro", "2nde", "CAP"],
  isSingleStep: true,
  sections: ["Puissances"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculatePowerQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
};
