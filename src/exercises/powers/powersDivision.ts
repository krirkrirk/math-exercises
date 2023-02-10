import { randint } from "../../mathutils/random/randint";
import { Power } from "../../numbers/integer/power";
import { latexParser } from "../../tree/parsers/latexParser";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { FractionNode } from "../../tree/nodes/operators/fractionNode";
import { MultiplyNode } from "../../tree/nodes/operators/multiplyNode";
import { PowerNode } from "../../tree/nodes/operators/powerNode";
import { Exercise, Question } from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

/**
 * a^b/a^c
 */

export const powersDivision: Exercise = {
  id: "powersDivision",
  connector: "=",
  instruction: "Calculer :",
  label: "Division de puissances",
  levels: ["4", "3", "2", "1"],
  section: "Puissances",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersDivisionQuestion, nb),
};
export const powersOfTenDivision: Exercise = {
  id: "powersOfTenDivision",
  connector: "=",
  instruction: "Calculer :",
  label: "Division de puissances de 10",
  levels: ["4", "3", "2", "1"],
  section: "Puissances",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersDivisionQuestion(true), nb),
};

export function getPowersDivisionQuestion(useOnlyPowersOfTen: boolean = false): Question {
  const a = useOnlyPowersOfTen ? 10 : randint(-11, 11, [0]);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new FractionNode(
    new PowerNode(new NumberNode(a), new NumberNode(b)),
    new PowerNode(new NumberNode(a), new NumberNode(c))
  );
  const answerTree = new Power(a, b - c).simplify();

  const question: Question = {
    startStatement: latexParser(statement),
    answer: latexParser(answerTree),
  };
  return question;
}
