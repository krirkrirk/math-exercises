import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  GGBVEA,
  addValidProp,
  shuffleProps,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { coinFlip } from "#root/utils/alea/coinFlip";

type Identifiers = {
  nodeIds: any;
  type: number;
};

const getOperationsPrioritiesParenthesisQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const type = randint(1, 5);
  let a: number, b: number, c: number, d: number;
  let statement: AlgebraicNode;
  let answer = "";
  switch (type) {
    case 1: //a*(b+-c)
      a = randint(-10, 11, [0, 1, -1]);
      [b, c] = [1, 2].map((el) => randint(-10, 11, [0]));
      statement = new MultiplyNode(
        a.toTree(),
        new AddNode(b.toTree(), c.toTree()),
        { forceTimesSign: true },
      );
      (statement as MultiplyNode).shuffle();
      answer = (a * (b + c)).frenchify();
      break;
    case 2: //a/(b+-c) ou (b+-c)/a
      if (coinFlip()) {
        //a/(b+-c)
        b = randint(-10, 11);
        c = randint(-10, 11, [-b]);
        a = (b + c) * randint(2, 10);
        statement = new DivideNode(
          a.toTree(),
          new AddNode(b.toTree(), c.toTree()),
        );
        answer = (a / (b + c)).frenchify();
      } else {
        //(b+-c)/a
        a = randint(2, 10);
        let k = a * randint(2, 10);
        b = k - randint(-10, 11, [0]);
        c = k - b;
        statement = new DivideNode(
          new AddNode(b.toTree(), c.toTree()),
          a.toTree(),
        );
        answer = ((b + c) / a).frenchify();
      }
      break;
    case 3: // (a+-b)*/(c+-d)
      if (coinFlip()) {
        //(a+-b)*(c+-d)
        [a, b, c, d] = [1, 2, 3, 4].map((el) => randint(-10, 11, [0]));
        statement = new MultiplyNode(
          new AddNode(a.toTree(), b.toTree()),
          new AddNode(c.toTree(), d.toTree()),
          { forceTimesSign: true },
        );
        answer = ((a + b) * (c + d)).frenchify();
      } else {
        //(a+-b)/(c+-d)
        c = randint(-10, 11, [0]);
        d = randint(-10, 11, [0, -c]);
        let k = randint(2, 10) * (c + d);
        a = k - randint(-10, 11, [0]);
        b = k - a;
        statement = new DivideNode(
          new AddNode(a.toTree(), b.toTree()),
          new AddNode(c.toTree(), d.toTree()),
        );
        answer = ((a + b) / (c + d)).frenchify();
      }
      break;
    case 4: // a +- (b+- c/*d)
    default:
      a = randint(-10, 11, [0]);
      b = randint(-10, 11, [0]);

      d = randint(2, 10);
      const isAdd = coinFlip();
      const isDivide = coinFlip();
      if (isDivide) c = d * randint(2, 10);
      else c = randint(-10, 11, [0]);
      const isAdd2 = coinFlip();
      statement = new (isAdd ? AddNode : SubstractNode)(
        a.toTree(),
        new (isAdd2 ? AddNode : SubstractNode)(
          b.toTree(),
          new (isDivide ? DivideNode : MultiplyNode)(c.toTree(), d.toTree(), {
            forceTimesSign: true,
          }),
          { forceParenthesis: isAdd },
        ),
      );
      answer = statement.evaluate({}).toString();
      break;
  }

  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer : $${statement.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { nodeIds: statement.toIdentifiers(), type },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randint(-100, 100) + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const operationsPrioritiesParenthesis: Exercise<Identifiers> = {
  id: "operationsPrioritiesParenthesis",
  connector: "=",
  label: "Priorités opératoires avec parenthèses",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getOperationsPrioritiesParenthesisQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
