import { randint } from "../../../mathutils/random/randint";
import { Integer } from "../../../numbers/integer/integer";
import { multiply } from "../../../operations/multiply";
import { AffineConstructor } from "../../../polynomials/affine";
import { DiscreteSet } from "../../../sets/discreteSet";
import { Interval } from "../../../sets/intervals/intervals";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

export const simpleDistributivity: Exercise = {
  connector: "=",
  instruction: "Développer et réduire :",
  label: "Distributivité simple",
  levels: ["3", "2"],
  section: "Calcul Littéral",
  generator: (nb: number) => getDistinctQuestions(getSimpleDistributivityQuestion, nb),
};

export function getSimpleDistributivityQuestion(): Question {
  const interval = new Interval("[[-10; 10]]").difference(new DiscreteSet([new Integer(0, "0")]));
  const affine = AffineConstructor.random(interval, interval);
  const coeff = interval.getRandomElement();
  return {
    statement: multiply.texApply(coeff.tex, affine),
    answer: "",
  };
}
