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
import { Decimal } from "#root/math/numbers/decimals/decimal";
import { Rational } from "#root/math/numbers/rationals/rational";
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { Node } from "#root/tree/nodes/node";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { PercentNode } from "#root/tree/nodes/numbers/percentNode";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { shuffle } from "#root/utils/shuffle";

const getFractionToPercentToDecimal: QuestionGenerator<Identifiers> = () => {
  const denominator = 2 ** randint(0, 5) * 5 ** randint(0, 5);
  const numerator =
    denominator !== 1 ? randint(1, denominator) : randint(1, 100);

  const fraction = new FractionNode(
    new NumberNode(numerator),
    new NumberNode(denominator),
  );
  const decimal = numerator / denominator;
  const percent = round((numerator / denominator) * 100, 2);

  const rand = randint(1, 7);
  let instruction = "";
  let answer = "";

  const percentTex = `${percent}\\%`;
  const fracTex = new Rational(numerator, denominator)
    .simplify()
    .toTree()
    .toTex();
  const decimalTex = `${decimal}`;
  switch (rand) {
    case 1: {
      instruction = `Écrire le nombre $${String(decimal).replace(
        ".",
        ",",
      )}$ sous forme de pourcentage.`;
      answer = percentTex;
      break;
    }
    case 2: {
      instruction = `Écrire le nombre $${String(decimal).replace(
        ".",
        ",",
      )}$ sous forme de fraction.`;
      answer = fracTex;
      break;
    }
    case 3: {
      instruction = `Écrire le nombre $${String(percent).replace(
        ".",
        ",",
      )}\\%$ sous forme décimale.`;
      answer = decimalTex;
      break;
    }
    case 4: {
      instruction = `Écrire le nombre $${String(percent).replace(
        ".",
        ",",
      )}\\%$ sous forme de fraction.`;
      answer = fracTex;
      break;
    }
    case 5: {
      instruction = `Écrire le nombre $${fraction.toTex()}$ sous forme décimale.`;
      answer = decimalTex;
      break;
    }
    case 6: {
      instruction = `Écrire le nombre $${fraction.toTex()}$ sous forme de pourcentage.`;
      answer = percentTex;
      break;
    }
  }
  answer = frenchify(answer);
  const question: Question<Identifiers> = {
    instruction,
    answer,
    keys: ["percent"],
    answerFormat: "tex",
    identifiers: {
      rand,
      numerator,
      denominator,
    },
  };

  return question;
};

type Identifiers = {
  rand: number;
  numerator: number;
  denominator: number;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, rand, numerator, denominator },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const decimal = numerator / denominator;
  const percent = round((numerator / denominator) * 100, 2);
  while (propositions.length < n) {
    let statement: string = "";

    switch (rand) {
      case 1:
        const temp1 = randint(-5, 3, [0]);
        statement = `${frenchify(round(percent * 10 ** temp1, -temp1 + 2))}\\%`;
        break;
      case 2:
        statement = `${new Rational(
          numerator * randint(1, 20, [0, 1]),
          denominator * randint(1, 20, [0, 1]),
        )
          .simplify()
          .toTree()
          .toTex()}`;
        break;
      case 3:
        const temp3 = randint(-5, 3, [0]);
        statement = `${frenchify(round(percent * 10 ** temp3, -temp3 + 2))}`;
        break;
      case 4:
        statement = `${new Rational(
          numerator * randint(1, 20, [0, 1]),
          denominator * randint(1, 20, [0, 1]),
        )
          .simplify()
          .toTree()
          .toTex()}`;
        break;
      case 5:
        statement = `${frenchify(round(decimal + Math.random() * 10, 2))}`;
        break;
      case 6:
        statement = `${frenchify(round(percent + Math.random() * 10, 2))}\\%`;
        break;
    }
    tryToAddWrongProp(propositions, statement);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { rand, numerator, denominator },
) => {
  const decimal = numerator / denominator;
  const percent = round((numerator / denominator) * 100, 2);
  const percentNode = new PercentNode(percent);
  const fracNode = new Rational(numerator, denominator).simplify().toTree();
  const decimalNode = new Decimal(decimal).toTree();
  let answer: Node;
  switch (rand) {
    case 1:
    case 6: {
      answer = percentNode;
      break;
    }
    case 2:
    case 4: {
      answer = fracNode;
      break;
    }
    case 3:
    case 5: {
      answer = decimalNode;
      break;
    }
    default:
      throw Error("wrong type in fractiontopercenttodecimal");
  }
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const fractionToPercentToDecimal: Exercise<Identifiers> = {
  id: "fractionToPercentToDecimal",
  connector: "\\iff",
  label: "Passer d'une écriture d'un nombre à une autre",
  levels: ["3ème", "2nde", "1reESM", "CAP", "2ndPro", "1rePro"],
  sections: ["Fractions"],
  isSingleStep: false,
  generator: (nb: number) =>
    getDistinctQuestions(getFractionToPercentToDecimal, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
