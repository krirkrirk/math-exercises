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
import { Integer } from "#root/math/numbers/integer/integer";
import {
  SquareRoot,
  SquareRootConstructor,
} from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { AlgebraicNode } from "#root/tree/nodes/algebraicNode";
import { SqrtNode } from "#root/tree/nodes/functions/sqrtNode";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { SquareNode } from "#root/tree/nodes/operators/powerNode";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { probaFlip } from "#root/utils/alea/probaFlip";
import { shuffle } from "#root/utils/alea/shuffle";

type Identifiers = {
  type: number;
  a: number;
  x: number;
  b: number | undefined;
  y: number;
};

const getAnswer = (
  type: number,
  firstTerm: AlgebraicNode,
  secondTerm: AlgebraicNode,
) => {
  switch (type) {
    case 1: //(a+b)^2
      return new AddNode(
        new SquareNode(firstTerm),
        new AddNode(
          new SquareNode(secondTerm),
          new MultiplyNode(
            new NumberNode(2),
            new MultiplyNode(firstTerm, secondTerm),
          ),
        ),
      ).simplify({ keepPowers: false });
    case 2:
      return new AddNode(
        new SquareNode(firstTerm),
        new SubstractNode(
          new SquareNode(secondTerm),
          new MultiplyNode(
            new NumberNode(2),
            new MultiplyNode(firstTerm, secondTerm),
          ),
        ),
      ).simplify({ keepPowers: false });
    case 3:
    default:
      return new SubstractNode(
        new SquareNode(firstTerm),
        new SquareNode(secondTerm),
      ).simplify({ keepPowers: false });
  }
};
//(x sqrt(a) +- [y || y*sqrt(b)])^2
//ou (x sqrt(a) + [y || y*sqrt(b)])(x sqrt(a) - [y || y*sqrt(b)])
const getSquareRootIdentitiesQuestion: QuestionGenerator<Identifiers> = () => {
  const type = randint(1, 4);
  const a = SquareRootConstructor.randomIrreductible(10);
  const x = randint(1, 7);
  let b: SquareRoot | undefined;
  let y = randint(1, 7);
  const otherTermIsSqrt = probaFlip(0.3);
  if (otherTermIsSqrt) {
    do {
      b = SquareRootConstructor.randomIrreductible(10);
    } while (b.operand === a.operand);
  }
  const firstTerm = new MultiplyNode(new NumberNode(x), a.toTree());

  const secondTerm = otherTermIsSqrt
    ? new MultiplyNode(new NumberNode(y), b!.toTree())
    : new NumberNode(y);
  let statement: AlgebraicNode;
  switch (type) {
    case 1: //(a+b)^2
      statement = new SquareNode(new AddNode(firstTerm, secondTerm));
      break;
    case 2:
      statement = new SquareNode(new SubstractNode(firstTerm, secondTerm));
      break;
    case 3:
    default:
      statement = new MultiplyNode(
        new AddNode(firstTerm, secondTerm),
        new SubstractNode(firstTerm, secondTerm),
      );
  }
  const answer = getAnswer(type, firstTerm, secondTerm).toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `Développer et simplifier : $${statement.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { type, a: a.operand, b: b?.operand, x, y },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, a, b, type, x, y },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const firstTerm = new MultiplyNode(
    new NumberNode(x),
    new SqrtNode(new NumberNode(a)),
  );

  const secondTerm = b
    ? new MultiplyNode(new NumberNode(y), new SqrtNode(new NumberNode(b)))
    : new NumberNode(y);

  switch (type) {
    case 1:
      tryToAddWrongProp(
        propositions,
        new AddNode(new SquareNode(firstTerm), new SquareNode(secondTerm))
          .simplify({ forbidFactorize: true })
          .toTex(),
      );
      while (propositions.length < n) {
        tryToAddWrongProp(
          propositions,
          new AddNode(
            new NumberNode(randint(1, 100)),
            new MultiplyNode(
              new NumberNode(randint(1, 100)),
              SquareRootConstructor.randomIrreductible().toTree(),
            ),
          ).toTex(),
        );
      }
      break;
    case 2:
      tryToAddWrongProp(
        propositions,
        new SubstractNode(new SquareNode(firstTerm), new SquareNode(secondTerm))
          .simplify({ forbidFactorize: true })
          .toTex(),
      );
      while (propositions.length < n) {
        tryToAddWrongProp(
          propositions,
          new SubstractNode(
            new NumberNode(randint(1, 100)),
            new MultiplyNode(
              new NumberNode(randint(1, 100)),
              SquareRootConstructor.randomIrreductible().toTree(),
            ),
          ).toTex(),
        );
      }
      break;
    case 3:
    default:
      tryToAddWrongProp(
        propositions,
        new SubstractNode(new SquareNode(secondTerm), new SquareNode(firstTerm))
          .simplify({ forbidFactorize: true })
          .toTex(),
      );
      while (propositions.length < n) {
        tryToAddWrongProp(propositions, randint(-100, 100) + "");
      }
      break;
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { a, b, type, x, y }) => {
  const firstTerm = new MultiplyNode(
    new NumberNode(x),
    new SqrtNode(new NumberNode(a)),
  );

  const secondTerm = b
    ? new MultiplyNode(new NumberNode(y), new SqrtNode(new NumberNode(b)))
    : new NumberNode(y);
  const answer = getAnswer(type, firstTerm, secondTerm);
  const texs = answer.toAllValidTexs();
  return texs.includes(ans);
};
export const squareRootIdentities: Exercise<Identifiers> = {
  id: "squareRootIdentities",
  connector: "=",
  label: "Identités remarquables avec des racines carrées",
  levels: ["2nde", "1reSpé"],
  isSingleStep: true,
  sections: ["Racines carrées", "Calcul littéral"],
  generator: (nb: number) =>
    getDistinctQuestions(getSquareRootIdentitiesQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
