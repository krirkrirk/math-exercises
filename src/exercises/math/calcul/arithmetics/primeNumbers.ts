import { randint } from "#root/math/utils/random/randint";

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
} from "../../../exercise";
import { getDistinctQuestions } from "../../../utils/getDistinctQuestions";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { operatorComposition } from "#root/tree/utilities/operatorComposition";

function prodNumbers(tab: number[]) {
  let temp = 1;
  for (let i = 0; i < tab.length; i++) temp *= tab[i];
  return temp;
}

const primes = [2, 3, 5, 7, 11];

const getPrimeNumbers: QuestionGenerator<Identifiers> = () => {
  const rand = randint(3, 5);
  let chosenNumbers: number[] = [];

  let elevenCount = 0;

  for (let i = 0; i < rand; i++) {
    let temp = randint(0, 5);
    if (temp === 4) elevenCount++;
    while (elevenCount >= 2 && temp === 4) temp = randint(0, 5);
    chosenNumbers.push(primes[temp]);
  }

  const prod = prodNumbers(chosenNumbers);

  chosenNumbers = chosenNumbers.sort((a, b) => a - b);

  const numberNodes = chosenNumbers.map((nb) => new NumberNode(nb));
  let tree = new MultiplyNode(
    numberNodes[numberNodes.length - 2],
    numberNodes[numberNodes.length - 1],
  );
  for (let i = numberNodes.length - 3; i > -1; i--) {
    tree = new MultiplyNode(numberNodes[i], tree);
  }

  let answer = tree.toTex();

  const question: Question<Identifiers> = {
    instruction: `Donner la décomposition en nombres premiers de : $${prod}$`,
    startStatement: `${prod}`,
    answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { chosenNumbers },
  };
  return question;
};

type Identifiers = {
  chosenNumbers: number[];
};
const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, chosenNumbers },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const wrongFactors = [...chosenNumbers];

  while (propositions.length < n) {
    let wrongFactor, newFactor, randomIndex, wrongAnswer: string;
    randomIndex = randint(0, wrongFactors.length);
    wrongFactor = wrongFactors[randomIndex];

    newFactor = wrongFactor;
    while (newFactor === wrongFactor) {
      const temp = randint(0, primes.length);
      newFactor = primes[temp];
    }

    wrongFactors[randomIndex] = newFactor;

    wrongAnswer = `${wrongFactors[0]}`;
    for (let j = 1; j < wrongFactors.length; j++) {
      wrongAnswer += `\\times` + wrongFactors[j];
    }

    tryToAddWrongProp(propositions, wrongAnswer);
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { chosenNumbers }) => {
  //array of [nombre, power]
  const nbsToPower: [number, number][] = [];
  chosenNumbers.forEach((nb) => {
    if (nbsToPower.some((el) => el[0] === nb)) return;
    const count = chosenNumbers.filter((el) => el === nb).length;
    nbsToPower.push([nb, count]);
  });
  const nodes = nbsToPower.map((el) => {
    const nbNode = new NumberNode(el[0]);
    if (el[1] === 1) {
      return nbNode;
    } else {
      return new PowerNode(nbNode, new NumberNode(el[1]));
    }
  });
  const answer =
    nodes.length === 1 ? nodes[0] : operatorComposition(MultiplyNode, nodes);
  const texs = answer.toAllValidTexs();
  console.log(texs);
  return texs.includes(ans);
};

export const primeNumbers: Exercise<Identifiers> = {
  id: "primeNumbers",
  connector: "=",
  label: "Décomposition en nombres premiers",
  levels: ["5ème", "4ème", "3ème", "2nde"],
  sections: ["Arithmétique"],
  isSingleStep: false,
  generator: (nb: number) => getDistinctQuestions(getPrimeNumbers, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
