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
import { Node } from "#root/tree/nodes/node";
import { NodeConstructor } from "#root/tree/nodes/nodeConstructor";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { diceFlip } from "#root/utils/diceFlip";

type Identifiers = { nodeIds: any; type: number; subType: number };

const getExpressionNatureQuestion: QuestionGenerator<Identifiers> = () => {
  let answer = "";
  let statement = "";
  let node: AlgebraicNode;

  let subType: number;
  //   const type = diceFlip(4);

  const a = randint(1, 10).toTree();
  const b = randint(1, 10).toTree();
  const c = randint(1, 10).toTree();
  const d = randint(1, 10).toTree();

  const type = randint(0, 4);
  switch (type) {
    case 0:
      //somme
      subType = diceFlip(5);
      switch (subType) {
        case 1:
          //ab+c
          node = new AddNode(new MultiplyNode(a, b), c);
          (node as AddNode).shuffle();
          break;
        case 2:
          //ab + cd
          node = new AddNode(new MultiplyNode(a, b), new MultiplyNode(c, d));
          break;
        case 3:
          //a/b + c
          node = new AddNode(new DivideNode(a, b), c);
          (node as AddNode).shuffle();
          break;
        case 4:
          //ab + c/d
          node = new AddNode(new MultiplyNode(a, b), new DivideNode(c, d));
          (node as AddNode).shuffle();
          break;
        case 5:
          //a/b + c/d
          node = new AddNode(new DivideNode(a, b), new DivideNode(c, d));
          break;
      }
      answer = "une somme";
      break;
    case 1:
      //différence

      subType = diceFlip(5);
      switch (subType) {
        case 1:
          //ab+c
          node = new SubstractNode(new MultiplyNode(a, b), c);
          (node as SubstractNode).dangerouslyShuffle();
          break;
        case 2:
          //ab - cd
          node = new SubstractNode(
            new MultiplyNode(a, b),
            new MultiplyNode(c, d),
          );
          break;
        case 3:
          //a/b - c
          node = new SubstractNode(new DivideNode(a, b), c);
          (node as SubstractNode).dangerouslyShuffle();
          break;
        case 4:
          //ab - c/d
          node = new SubstractNode(
            new MultiplyNode(a, b),
            new DivideNode(c, d),
          );
          (node as SubstractNode).dangerouslyShuffle();
          break;
        case 5:
          //a/b - c/d
          node = new SubstractNode(new DivideNode(a, b), new DivideNode(c, d));
          break;
      }
      answer = "une différence";
      break;
    case 2:
      //produit
      subType = diceFlip(5);
      switch (subType) {
        case 1:
          //(a+b)*c
          node = new MultiplyNode(new AddNode(a, b), c);
          (node as MultiplyNode).shuffle();
          break;
        case 2:
          //(a-b)*c
          node = new MultiplyNode(new SubstractNode(a, b), c);
          (node as MultiplyNode).shuffle();

          break;
        case 3:
          //(a+b)(c+d)
          node = new MultiplyNode(new AddNode(a, b), new AddNode(c, d));
          break;
        case 4:
          //(a+b)(c-d)
          node = new MultiplyNode(new AddNode(a, b), new SubstractNode(c, d));
          (node as MultiplyNode).shuffle();

          break;
        case 5:
          //(a-b)(c-d)
          node = new MultiplyNode(
            new SubstractNode(a, b),
            new SubstractNode(c, d),
          );
          break;
      }
      answer = "un produit";
      break;
    case 3:
    default:
      //quotient
      subType = diceFlip(5);
      switch (subType) {
        case 1:
          //(a+b)/c
          node = new DivideNode(new AddNode(a, b), c);
          (node as DivideNode).dangerouslyShuffle();
          break;
        case 2:
          //(a-b)/c
          node = new DivideNode(new SubstractNode(a, b), c);
          (node as DivideNode).dangerouslyShuffle();
          break;
        case 3:
          //(a+b)/(c+d)
          node = new DivideNode(new AddNode(a, b), new AddNode(c, d));
          break;
        case 4:
          //(a+b)/(c-d)
          node = new DivideNode(new AddNode(a, b), new SubstractNode(c, d));
          (node as DivideNode).dangerouslyShuffle();
          break;
        case 5:
          //(a-b)/(c-d)
          node = new DivideNode(
            new SubstractNode(a, b),
            new SubstractNode(c, d),
          );
          break;
      }
      answer = "un quotient";
      break;
  }
  statement = node!.toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `L'expression $${statement}$ est : `,
    keys: [],
    answerFormat: "raw",
    identifiers: { nodeIds: node!.toIdentifiers(), type, subType },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer, "raw");
  tryToAddWrongProp(propositions, "une somme", "raw");
  tryToAddWrongProp(propositions, "un produit", "raw");
  tryToAddWrongProp(propositions, "une différence", "raw");
  tryToAddWrongProp(propositions, "un quotient", "raw");
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, nodeIds }) => {
  return ans === answer;
};

export const expressionNature: Exercise<Identifiers> = {
  id: "expressionNature",
  connector: "=",
  label:
    "Déterminer la nature d'une expression (somme/produit/différence/quotient)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getExpressionNatureQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  answerType: "QCU",
};
