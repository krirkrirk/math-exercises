/**
 * (a^b)^c
 */

import { Power } from "#root/math/numbers/integer/power";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PowerNode, power } from "#root/tree/nodes/operators/powerNode";
import { powerParser } from "#root/tree/parsers/powerParser";
import { rationalParser } from "#root/tree/parsers/rationalParser";
import { shuffle } from "#root/utils/alea/shuffle";
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
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
type Identifiers = {
  a: number;
  b: number;
  c: number;
};
type Options = {
  useOnlyPowersOfTen: boolean;
};
const getPowersPowerQuestion: QuestionGenerator<Identifiers, Options> = (
  opts,
) => {
  const a = opts?.useOnlyPowersOfTen ? 10 : randint(-11, 11, [0, 1]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = power(power(a, b), c);
  let answerTree = power(a, b * c).simplify();
  const answer = answerTree.toTex();
  const statementTex = statement.toTex();
  const question: Question<Identifiers, Options> = {
    instruction: `Simplifier : 
    
$$
${statementTex}
$$`,

    startStatement: statementTex,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { a, b, c },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, a, b, c }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  if (a === -1) {
    tryToAddWrongProp(propositions, "1");
    tryToAddWrongProp(propositions, "-1");
    tryToAddWrongProp(propositions, "0");
    tryToAddWrongProp(propositions, "-2");
  }

  while (propositions.length < n) {
    const wrongExponent = b * c + randint(-11, 11, [0]);
    const wrongAnswerTree = new Power(a, wrongExponent).simplify();
    const wrongAnswer = wrongAnswerTree.toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};
const isAnswerValid: VEA<Identifiers> = (ans, { a, b, c }) => {
  const powerNode = power(a, b * c);
  const answerTree = powerNode.simplify();
  const ev = answerTree.evaluate();

  const parsed = rationalParser(ans);
  if (parsed && Math.abs(parsed.evaluate() - ev) < 0.000001) return true;
  const powerParsed = powerParser(ans);
  if (powerParsed && Math.abs(powerParsed.evaluate() - ev) < 0.000001)
    return true;
  return false;
};
export const powersOfTenPower: Exercise<Identifiers> = {
  id: "powersOfTenPower",
  connector: "=",
  label: "Puissance d'une puissance de 10 ",
  levels: [
    "4ème",
    "3ème",
    "2nde",
    "CAP",
    "2ndPro",
    "1reESM",
    "1rePro",
    "1reSpé",
    "1reTech",
    "TermPro",
    "TermTech",
  ],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getPowersPowerQuestion({ useOnlyPowersOfTen: true }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};

export const powersPower: Exercise<Identifiers> = {
  id: "powersPower",
  connector: "=",
  label: "Puissance d'une puissance",
  levels: ["4ème", "3ème", "2nde"],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(
      () => getPowersPowerQuestion({ useOnlyPowersOfTen: false }),
      nb,
    ),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
