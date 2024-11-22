import { numberVEA } from "#root/exercises/vea/numberVEA";
import {
  Decimal,
  DecimalConstructor,
} from "#root/math/numbers/decimals/decimal";
import { randint } from "#root/math/utils/random/randint";
import { Measure } from "#root/pc/measure/measure";
import { DistanceUnit, distanceUnits } from "#root/pc/units/distanceUnits";
import { random } from "#root/utils/alea/random";
import { shuffle } from "#root/utils/alea/shuffle";
import {
  Exercise,
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
  GetAnswer,
  GetInstruction,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
import { v4 } from "uuid";

type Identifiers = {
  randomUnitIndex: number;
  randomUnitInstructionIndex: number;
  randomLength: number;
};
type Options = {
  units: string[];
};
const units = ["mm", "cm", "dm", "m", "dam", "hm", "km"];
const unitsObj = [
  DistanceUnit.mm,
  DistanceUnit.cm,
  DistanceUnit.dm,
  DistanceUnit.m,
  DistanceUnit.dam,
  DistanceUnit.hm,
  DistanceUnit.km,
];

const getInstruction: GetInstruction<Identifiers, Options> = (
  identifiers,
  options,
) => {
  const measure = new Measure(
    identifiers.randomLength,
    0,
    unitsObj[identifiers.randomUnitIndex],
  );
  return `Compléter : $${measure.toTex({
    notScientific: true,
  })} = \\ldots  ${unitsObj[identifiers.randomUnitInstructionIndex].toTex()}$`;
};

const getAnswer: GetAnswer<Identifiers, Options> = (identifiers, options) => {
  const measure = new Measure(
    identifiers.randomLength,
    0,
    unitsObj[identifiers.randomUnitIndex],
  );
  const answer = measure
    .convert(units[identifiers.randomUnitInstructionIndex] as distanceUnits)
    .toTex({ notScientific: true, hideUnit: true });

  return answer;
};
const getLengthConversion: QuestionGenerator<Identifiers, Options> = (
  options,
) => {
  if (options && !validateOptions(options).valid)
    throw Error("options invalides, gen lengthConversion");

  const availableUnitsIndexes = units
    .map((e, i) => i)
    .filter((i) => !options?.units?.length || options.units.includes(units[i]));

  const randomUnitIndex = random(availableUnitsIndexes);
  const randomUnitInstructionIndex = random(availableUnitsIndexes, [
    randomUnitIndex,
  ]);
  const randomLength = DecimalConstructor.random(0, 1000, randint(0, 4));

  const identifiers = {
    randomLength: randomLength.value,
    randomUnitIndex,
    randomUnitInstructionIndex,
  };
  const question: Question<Identifiers, Options> = {
    instruction: getInstruction(identifiers, options),
    answer: getAnswer(identifiers, options),
    keys: [],
    answerFormat: "tex",
    identifiers,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers, Options> = (
  n,
  { answer, randomLength, randomUnitIndex, randomUnitInstructionIndex },
  options,
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  const lengthDecimal = new Decimal(randomLength);
  while (propositions.length < n) {
    const wrongAnswer = lengthDecimal
      .multiplyByPowerOfTen(
        randint(-3, 4, [randomUnitIndex - randomUnitInstructionIndex]),
      )
      .value.toString()
      .replace(".", ",");
    tryToAddWrongProp(propositions, wrongAnswer);
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return numberVEA(ans, answer);
};

const options: GeneratorOption[] = [
  {
    id: "units",
    label: "N'utiliser que les unités suivantes :",
    type: GeneratorOptionType.multiselect,
    target: GeneratorOptionTarget.generation,
    values: units,
  },
];

const validateOptions = (opts: Options) => {
  if (opts.units.length < 2)
    return {
      message: "Vous devez choisir au moins deux unités.",
      valid: false,
    };
  return {
    message: "Options valides",
    valid: true,
  };
};

export const lengthConversion: Exercise<Identifiers, Options> = {
  id: "lengthConversion",
  connector: "=",
  label: "Conversion de longueurs",
  levels: ["6ème", "5ème", "CAP", "2ndPro"],
  sections: ["Conversions"],
  isSingleStep: true,
  generator: (nb, opts) =>
    getDistinctQuestions(() => getLengthConversion(opts), nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getAnswer,
  getInstruction,
  options,
  validateOptions,
};
