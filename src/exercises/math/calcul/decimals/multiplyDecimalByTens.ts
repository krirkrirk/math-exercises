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
import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { DivideNode } from "#root/tree/nodes/operators/divideNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { PowerNode } from "#root/tree/nodes/operators/powerNode";
import { coinFlip } from "#root/utils/coinFlip";

type Identifiers = {
  dec: number;
  pow: number;
  isDivide: boolean;
};

const getMultiplyDecimalByTensQuestion: QuestionGenerator<Identifiers> = () => {
  const dec = DecimalConstructor.random(-200, 200, randint(1, 5));
  const pow = randint(1, 4);
  const factor = Math.pow(10, pow);
  const isDivide = coinFlip();
  const answer = dec
    .multiplyByPowerOfTen(isDivide ? -pow : pow)
    .toTree()
    .toTex();
  const statement = new (isDivide ? DivideNode : MultiplyNode)(
    dec.toTree(),
    factor.toTree(),
  );
  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer : $${statement.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { dec: dec.value, pow, isDivide },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, dec, isDivide, pow },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const decimal = new Decimal(dec);
  const opposite = decimal
    .multiplyByPowerOfTen(isDivide ? pow : -pow)
    .toTree()
    .toTex();
  tryToAddWrongProp(propositions, opposite);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      decimal
        .multiplyByPowerOfTen(randint(-5, 5, [pow, -pow]))
        .toTree()
        .toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const multiplyDecimalByTens: Exercise<Identifiers> = {
  id: "multiplyDecimalByTens",
  connector: "=",
  label: "Multiplier/diviser un décimal par une puissance de 10",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getMultiplyDecimalByTensQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
