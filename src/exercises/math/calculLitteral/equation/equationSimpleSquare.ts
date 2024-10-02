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
import { equationKeys } from "#root/exercises/utils/keys/equationKeys";
import { Rational } from "#root/math/numbers/rationals/rational";
import { SquareRoot } from "#root/math/numbers/reals/real";
import { randint } from "#root/math/utils/random/randint";
import { EquationSolutionNode } from "#root/tree/nodes/equations/equationSolutionNode";
import { OppositeNode } from "#root/tree/nodes/functions/oppositeNode";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import {
  DiscreteSetNode,
  EmptySet,
} from "#root/tree/nodes/sets/discreteSetNode";
import { coinFlip } from "#root/utils/coinFlip";
import { diceFlip } from "#root/utils/diceFlip";
import { isInt } from "#root/utils/isInt";
import { random } from "#root/utils/random";

const squares = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((el) => el ** 2);

const higherFactor = (n: number): number => {
  for (let i = Math.floor(Math.sqrt(n)); i > 0; i--)
    if (n % i ** 2 === 0) return i;
  return 1;
};

type Identifiers = {
  randNbr: number;
};

const getEquationSimpleSquare: QuestionGenerator<Identifiers> = () => {
  let randNbr = randint(-10, 101);

  const rand = diceFlip(3);
  if (rand === 0) randNbr = randint(-20, 0);
  else if (rand === 1) randNbr = random(squares);
  else randNbr = randint(2, 100);

  const instruction = `Résoudre l'équation : $x^2 = ${randNbr}$`;
  const sqrt = Math.sqrt(randNbr);
  let solutionsSet: DiscreteSetNode;
  let simplifiedRoot;
  if (randNbr < 0) {
    solutionsSet = new DiscreteSetNode([]);
  } else if (sqrt === Math.floor(sqrt)) {
    if (sqrt === 0) solutionsSet = new DiscreteSetNode([new NumberNode(0)]);
    else
      solutionsSet = new DiscreteSetNode([
        new NumberNode(-sqrt),
        new NumberNode(+sqrt),
      ]);
  } else {
    const tree = new SquareRoot(randNbr).simplify().toTree();
    solutionsSet = new DiscreteSetNode([new OppositeNode(tree), tree]);
  }

  const answer = new EquationSolutionNode(solutionsSet!).toTex();
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: equationKeys,
    answerFormat: "tex",
    identifiers: { randNbr },
    hint: `L'équation $x^2 = k$ : 
    
- n'admet pas de solution si $k<0$, 
- admet une solution si $k=0$, qui est $0$
- admet deux solutions si $k>0$, qui sont $-\\sqrt{k}$ et $\\sqrt{k}$
    `,
    correction: `
${
  randNbr < 0
    ? `L'équation $x^2 = ${randNbr}$ n'admet pas de solution, car $${randNbr}$ est négatif. Ainsi, $${answer}$.`
    : randNbr === 0
    ? `L'équation $x^2 = 0$ admet une unique solution : $0$. En effet, $0$ est le seul nombre qui au carré est égal à $0$. Ainsi, $${answer}$.`
    : `Puisque $${randNbr}>0$, l'équation $x^2 = ${randNbr}$ admet deux solutions : $-\\sqrt{${randNbr}}$ et $\\sqrt{${randNbr}}$. 
    
${
  new SquareRoot(randNbr).isSimplifiable()
    ? `Or, $\\sqrt{${randNbr}}=${new SquareRoot(randNbr)
        .simplify()
        .toTree()
        .toTex()}$.`
    : ""
}

Ainsi, $${answer}$.
`
}
    `,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, randNbr }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const half = new Rational(randNbr, 2).simplify().toTree();

  if (randNbr < 0) {
    tryToAddWrongProp(
      propositions,
      `S=\\left\\{-\\sqrt{${-randNbr}}\\right\\}`,
    );
    tryToAddWrongProp(
      propositions,
      `S=\\left\\{\\sqrt{-${-randNbr}}\\right\\}`,
    );

    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(new DiscreteSetNode([half])).toTex(),
    );
  } else if (isInt(Math.sqrt(randNbr))) {
    const sqrt = Math.sqrt(randNbr);
    tryToAddWrongProp(propositions, `S=\\left\\{${sqrt}\\right\\}`);
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(new DiscreteSetNode([half])).toTex(),
    );
    while (propositions.length < n) {
      const tempAns = sqrt + randint(-sqrt + 1, 7, [0]);
      tryToAddWrongProp(
        propositions,
        coinFlip()
          ? `S=\\left\\{-${tempAns};${tempAns}\\right\\}`
          : `S=\\varnothing`,
      );
    }
  } else {
    const sqrtTree = new SquareRoot(randNbr).simplify().toTree();
    const sqrt = Math.sqrt(randNbr);
    const factor = higherFactor(randNbr);
    const radicand = randNbr / factor ** 2;
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(new DiscreteSetNode([sqrtTree])).toTex(),
    );
    tryToAddWrongProp(
      propositions,
      new EquationSolutionNode(new DiscreteSetNode([half])).toTex(),
    );

    while (propositions.length < n) {
      const tempFactor = factor + randint(-factor + 1, 7, [0]);
      const tempRadicand = radicand + randint(-radicand + 1, 7, [0]);
      tryToAddWrongProp(
        propositions,
        coinFlip()
          ? `S=\\left\\{-${tempFactor}\\sqrt{${tempRadicand}};${tempFactor}\\sqrt{${tempRadicand}}\\right\\}`
          : `S=\\varnothing`,
      );
    }
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { randNbr }) => {
  let answerTrees: EquationSolutionNode[] = [];
  if (randNbr < 0) {
    answerTrees = [new EquationSolutionNode(EmptySet)];
  } else if (randNbr === 0) {
    answerTrees = [
      new EquationSolutionNode(new DiscreteSetNode([new NumberNode(0)])),
    ];
  }
  // else if (randNbr === 1) {
  //   answerTrees = [
  //     new EquationSolutionNode(new DiscreteSetNode([new NumberNode(1)])),
  //   ];
  // }
  else {
    const sqrt = new SquareRoot(randNbr);
    const sqrtTree = sqrt.toTree();
    answerTrees.push(
      new EquationSolutionNode(
        new DiscreteSetNode([new OppositeNode(sqrtTree), sqrtTree]),
      ),
    );

    if (sqrt.isSimplifiable()) {
      const simplified = sqrt.simplify().toTree();
      answerTrees.push(
        new EquationSolutionNode(
          new DiscreteSetNode([new OppositeNode(simplified), simplified]),
        ),
      );
    }
  }
  const texs = answerTrees.flatMap((tree) => tree.toAllValidTexs());
  return texs.includes(ans);
};

export const equationSimpleSquare: Exercise<Identifiers> = {
  id: "equationSimpleSquare",
  connector: "=",
  label: "Résoudre une équation du second degré du type $x^2 = a$",
  levels: ["2nde", "1reESM", "1reSpé", "1reTech"],
  sections: ["Équations"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getEquationSimpleSquare, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
