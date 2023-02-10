import { randint } from "../../mathutils/random/randint";
import { latexParser } from "../../tree/parsers/latexParser";
import { Node } from "../../tree/nodes/node";
import { NumberNode } from "../../tree/nodes/numbers/numberNode";
import { AddNode } from "../../tree/nodes/operators/addNode";
import { DivideNode } from "../../tree/nodes/operators/divideNode";
import { MultiplyNode } from "../../tree/nodes/operators/multiplyNode";
import { coin } from "../../utils/coin";
import { Exercise, Question } from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

/**
 * a*b ±c±d
 * a/b ±c±d
 * a*b*c ± d
 * a*b±c*d
 * a/b ± c*d
 */

export const operationsPriorities: Exercise = {
  id: "operationsPrioritiesWithoutRelative",
  connector: "=",
  instruction: "Calculer :",
  label: "Priorités opératoires (sans relatif)",
  levels: ["6", "5", "4"],
  section: "Calculs",
  isSingleStep: true,
  generator: (nb: number) => getDistinctQuestions(getPriorityQuestionsWithoutRelatif, nb),
};

export function getPriorityQuestionsWithoutRelatif(): Question {
  const type = randint(1, 6);
  let statement: Node;
  let answer: string = "";
  let a, b, c, d: number;

  switch (type) {
    case 1: // a*b ±c±d
      [c, d] = [1, 2, 3, 4].map((el) => randint(-10, 11, [0]));
      [a, b] = [1, 2].map((el) => randint(-10, 11));
      statement = coin()
        ? //a*b first ou last
          new AddNode(
            new MultiplyNode(new NumberNode(a), new NumberNode(b)),
            new AddNode(new NumberNode(c), new NumberNode(d))
          ).shuffle()
        : //a*b middle
          new AddNode(
            new AddNode(new NumberNode(c), new MultiplyNode(new NumberNode(a), new NumberNode(b))),
            new NumberNode(d)
          );
      answer = (a * b + c + d).toString();
      break;
    case 2: // a/b ±c±d
      [b, c, d] = [1, 2, 3].map((el) => randint(-10, 11, [0]));
      a = b * randint(0, 11);
      statement = coin()
        ? //a/b first ou last
          new AddNode(
            new DivideNode(new NumberNode(a), new NumberNode(b)),
            new AddNode(new NumberNode(c), new NumberNode(d))
          ).shuffle()
        : //a/b middle
          new AddNode(
            new AddNode(new NumberNode(c), new DivideNode(new NumberNode(a), new NumberNode(b))),
            new NumberNode(d)
          );
      answer = (a / b + c + d).toString();
      break;
    case 3: // a*b ± c*d
      [a, b, c, d] = [1, 2, 3, 4].map((el) => randint(-10, 11));
      statement = new AddNode(
        new MultiplyNode(new NumberNode(a), new NumberNode(b)),
        new MultiplyNode(new NumberNode(c), new NumberNode(d))
      );
      answer = (a * b + c * d).toString();
      break;
    case 4: // a*b ± c/d
      [a, b] = [1, 2].map((el) => randint(-10, 11));
      d = randint(-10, 11, [0]);
      c = d * randint(0, 11);
      statement = new AddNode(
        new MultiplyNode(new NumberNode(a), new NumberNode(b)),
        new DivideNode(new NumberNode(c), new NumberNode(d))
      ).shuffle();
      answer = (a * b + c / d).toString();
      break;
    case 5: // a/b ± c/d
      [b, d] = [1, 2].map((el) => randint(-10, 11, [0]));
      a = b * randint(0, 11);
      c = d * randint(0, 11);
      statement = new AddNode(
        new DivideNode(new NumberNode(a), new NumberNode(b)),
        new DivideNode(new NumberNode(c), new NumberNode(d))
      );
      answer = (a / b + c / d).toString();
      break;
    case 5: // a*b*c ± d
      [b, d] = [1, 2].map((el) => randint(-10, 11, [0]));
      a = b * randint(0, 11);
      c = d * randint(0, 11);
      statement = new AddNode(
        new MultiplyNode(new MultiplyNode(new NumberNode(a), new NumberNode(b)), new NumberNode(c)),
        new NumberNode(d)
      ).shuffle();
      answer = (a * b * c + d).toString();
      break;
  }

  const question: Question = {
    startStatement: latexParser(statement!),
    answer: answer,
  };
  return question;
}
