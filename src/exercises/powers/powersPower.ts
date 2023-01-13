import { randint } from "../../mathutils/random/randint";
import { Integer } from "../../numbers/integer/integer";
import { Power } from "../../numbers/integer/power";
import { DiscreteSet } from "../../sets/discreteSet";
import { Interval } from "../../sets/intervals/intervals";
import { latexParser } from "../../tree/parsers/latexParser";
import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { AddNode } from "../../tree/nodes/operators/addNode";
import { DivideNode } from "../../tree/nodes/operators/divideNode";
import { MultiplyNode } from "../../tree/nodes/operators/multiplyNode";
import { PowerNode } from "../../tree/nodes/operators/powerNode";
import { coin } from "../../utils/coin";
import { Exercise, Question } from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

/**
 * (a^b)^c
 */

export const powersOfTenPower: Exercise = {
  id: "powersOfTenPower",
  connector: "=",
  instruction: "Calculer :",
  label: "Puissance d'une puissance de 10 ",
  levels: ["4", "3", "2", "1"],
  section: "Puissances",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(() => getPowersPowerQuestion(true), nb),
};

export const powersPower: Exercise = {
  id: "powersPower",
  connector: "=",
  instruction: "Calculer :",
  label: "Puissance d'une puissance",
  levels: ["4", "3", "2", "1"],
  section: "Puissances",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPowersPowerQuestion, nb),
};

export function getPowersPowerQuestion(useOnlyPowersOfTen: boolean = false): Question {
  const a = useOnlyPowersOfTen ? 10 : randint(-11, 11);
  const [b, c] = [1, 2].map((el) => randint(-11, 11));

  const statement = new PowerNode(new PowerNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c));
  let answerTree = new Power(a, b * c).simplify();

  const question: Question = {
    statement: latexParser(statement),
    answer: latexParser(answerTree),
  };
  return question;
}
