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
import { numberVEA } from "#root/exercises/vea/numberVEA";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { AddNode } from "#root/tree/nodes/operators/addNode";

type Identifiers = {
  numbers: number[];
};

const getMentalAddAndSubNoRelativeQuestion: QuestionGenerator<
  Identifiers
> = () => {
  let answer = -1;
  let statementTree: AddNode;
  let numbers: number[] = [];
  while (answer < 0) {
    const nbOperations = randint(2, 4);
    numbers = [];
    do {
      numbers = [];
      numbers.push(randfloat(1, 15, randint(1, 3)));
      let sum = numbers[0];

      for (let i = 1; i < nbOperations + 1; i++) {
        numbers.push(randfloat(-sum, 15, randint(1, 3), [0]));
        sum += numbers[i];
      }
    } while (numbers.every((a) => a > 0));

    const allNumbersNodes = numbers.map((nb) => new NumberNode(nb));
    statementTree = new AddNode(allNumbersNodes[0], allNumbersNodes[1]);
    for (let i = 2; i < allNumbersNodes.length; i++) {
      statementTree = new AddNode(statementTree, allNumbersNodes[i]);
    }
    answer = round(
      numbers.reduce((a, b) => a + b),
      2,
    );
  }
  const answerTex = answer.frenchify();

  const question: Question<Identifiers> = {
    answer: answerTex,
    instruction: `Calculer : $${statementTree!.toTex()}$`,
    startStatement: statementTree!.toTex(),
    keys: [],
    answerFormat: "tex",
    identifiers: { numbers },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const answerNb = answer.unfrenchify();
  while (propositions.length < n) {
    const incorrectAnswer = round(
      answerNb + Math.max(-answerNb, randfloat(-5, 6, randint(1, 3), [0])),
      2,
    );
    tryToAddWrongProp(propositions, incorrectAnswer.frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberVEA(ans, answer);
};

export const mentalAddAndSubNoRelative: Exercise<Identifiers> = {
  id: "mentalAddAndSubNoRelative",
  connector: "=",
  label: "Additions et soustractions avec des décimaux (sans relatifs)",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getMentalAddAndSubNoRelativeQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
