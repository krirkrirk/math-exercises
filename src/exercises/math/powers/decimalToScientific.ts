import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import {
  Integer,
  IntegerConstructor,
} from "#root/math/numbers/integer/integer";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { probaFlip } from "#root/utils/alea/probaFlip";
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
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";

type Identifiers = {
  decimal: number;
};

const getDecimalToScientificQuestion: QuestionGenerator<Identifiers> = () => {
  const isZero = probaFlip(0.2);
  let intPart: number, dec: Decimal;
  if (isZero) {
    dec = DecimalConstructor.fromParts(
      "0",
      DecimalConstructor.randomFracPart(randint(2, 5), randint(1, 2)),
    );
  } else {
    intPart = IntegerConstructor.random(randint(2, 5));
    dec = DecimalConstructor.fromParts(
      intPart.toString(),
      DecimalConstructor.randomFracPart(randint(1, 3)),
    );
  }
  const decTex = dec.toTree().toTex().replace(".", ",");
  const answer = dec.toScientificNotation().toTex();

  const question: Question<Identifiers> = {
    instruction: `Donner l'écriture scientifique de : $${decTex}$`,
    startStatement: decTex,
    answer: answer,
    keys: [],
    answerFormat: "tex",
    identifiers: { decimal: dec.value },
  };
  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, decimal }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const dec = new Decimal(decimal);
  while (propositions.length < n) {
    const wrongAnswer = new MultiplyNode(
      dec.toScientificPart().toTree(),
      new PowerNode(new NumberNode(10), new NumberNode(randint(-5, 5, [0, 1]))),
    ).toTex();
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { decimal }) => {
  const answerTree = new Decimal(decimal).toScientificNotation();
  const texs = answerTree.toAllValidTexs({ forbidPowerToProduct: true });
  return texs.includes(ans);
};

export const decimalToScientific: Exercise<Identifiers> = {
  id: "decimalToScientific",
  connector: "=",
  label: "Passer d'écriture décimale à écriture scientifique",
  levels: [
    "5ème",
    "4ème",
    "3ème",
    "2nde",
    "CAP",
    "2ndPro",
    "1reESM",
    "1rePro",
    "1reSpé",
    "1reTech",
    "TermPro",
    "TermTech",
  ],
  sections: ["Puissances"],
  isSingleStep: true,
  generator: (nb: number) =>
    getDistinctQuestions(getDecimalToScientificQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
