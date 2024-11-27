import {
  GeneratorOption,
  GeneratorOptionTarget,
  GeneratorOptionType,
} from "../exercise";

export const allowNonIrreductibleOption: GeneratorOption = {
  id: "allowNonIrreductible",
  label: "Autoriser les fractions non réduites",
  target: GeneratorOptionTarget.vea,
  type: GeneratorOptionType.checkbox,
};
