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
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";

type Identifiers = {
  dec: number;
  pow: number;
};

const getMultiplyDecimalByNegativeTensQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const dec = DecimalConstructor.random(1, 200, randint(1, 5));
  const pow = -randint(1, 4);
  const factor = Math.pow(10, pow);
  const answer = dec.multiplyByPowerOfTen(pow).toTree().toTex();
  const statement = new MultiplyNode(dec.toTree(), factor.toTree());
  const question: Question<Identifiers> = {
    answer,
    instruction: `Calculer : $${statement.toTex()}$`,
    keys: [],
    answerFormat: "tex",
    identifiers: { dec: dec.value, pow },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, dec, pow },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const decimal = new Decimal(dec);
  tryToAddWrongProp(
    propositions,
    decimal.multiplyByPowerOfTen(-pow).toTree().toTex(),
  );
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

export const multiplyDecimalByNegativeTens: Exercise<Identifiers> = {
  id: "multiplyDecimalByNegativeTens",
  connector: "=",
  label: "Multiplier un décimal par $0,1$, par $0,01$ ou par $0,001$",
  levels: [],
  isSingleStep: true,
  sections: [],
  generator: (nb: number) =>
    getDistinctQuestions(getMultiplyDecimalByNegativeTensQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
