import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { Polynomial } from "#root/math/polynomials/polynomial";
import { randint } from "#root/math/utils/random/randint";
import { Node } from "#root/tree/nodes/node";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  rand: number;
  polynome1Coeffs: number[];
  polynome2Coeffs: number[];
};

const getReduceExpression: QuestionGenerator<Identifiers> = () => {
  const rand = randint(0, 7);
  let polynome1: Polynomial;
  let polynome2: Polynomial;

  switch (rand) {
    case 0: // ax + b + cx + d
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([randint(-5, 6), randint(-5, 6, [0])]);
      break;

    case 1:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([0, randint(-5, 6, [0])]);
      break;

    case 2:
      polynome1 = new Polynomial([randint(-9, 10), randint(-9, 10, [0])]);
      polynome2 = new Polynomial([randint(-5, 6, [0])]);
      break;

    case 3:
      polynome1 = new Polynomial([
        randint(-9, 10),
        randint(-9, 10),
        randint(-9, 10, [0]),
      ]);
      polynome2 = new Polynomial([0, randint(-5, 6), randint(-5, 6, [0])]);
      break;

    case 4:
      polynome1 = new Polynomial([
        randint(-9, 10),
        randint(-9, 10),
        randint(-9, 10, [0]),
      ]);
      polynome2 = new Polynomial([0, 0, randint(-5, 6, [0])]);
      break;

    case 5:
      polynome1 = new Polynomial([
        randint(-9, 10),
        randint(-9, 10),
        randint(-9, 10, [0]),
      ]);
      polynome2 = new Polynomial([0, randint(-5, 6, [0])]);
      break;

    case 6:
      polynome1 = new Polynomial([
        randint(-9, 10),
        randint(-9, 10),
        randint(-9, 10, [0]),
      ]);
      polynome2 = new Polynomial([randint(-5, 6, [0])]);
      break;

    default:
      throw Error("something went wrong");
  }
  const statement = new AddNode(polynome1.toTree(), polynome2.toTree());
  statement.shuffle();
  const statementTex = statement.toTex();
  const answer = polynome1.add(polynome2).toTree().toTex();
  const question: Question<Identifiers> = {
    instruction: `Réduire l'expression suivante : $${statementTex}$`,
    startStatement: statementTex,
    answer,
    keys: ["x"],
    answerFormat: "tex",
    identifiers: {
      rand,
      polynome1Coeffs: polynome1.coefficients,
      polynome2Coeffs: polynome2.coefficients,
    },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rand, polynome1Coeffs },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const polynome1 = new Polynomial(polynome1Coeffs);
  while (propositions.length < n) {
    const polynome2 = new Polynomial(
      rand < 3
        ? [randint(-5, 6, [0]), randint(-5, 6, [0])]
        : [randint(-5, 6, [0]), randint(-5, 6, [0]), randint(-5, 6, [0])],
    );
    tryToAddWrongProp(propositions, polynome1.add(polynome2).toTree().toTex());
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { polynome1Coeffs, polynome2Coeffs, rand },
) => {
  const polynome1 = new Polynomial(polynome1Coeffs);
  const polynome2 = new Polynomial(polynome2Coeffs);
  const answer = polynome1
    .add(polynome2)
    .toTree({ forbidPowerToProduct: true });
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const reduceExpression: Exercise<Identifiers> = {
  id: "reduceExpression",
  connector: "=",
  isSingleStep: false,
  label: "Réduire une expression",
  levels: ["4ème", "3ème", "2nde", "CAP", "2ndPro"],
  sections: ["Calcul littéral"],
  generator: (nb: number) => getDistinctQuestions(getReduceExpression, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
