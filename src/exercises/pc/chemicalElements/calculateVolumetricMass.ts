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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { Measure } from "#root/pc/measure/measure";
import { DivideUnit } from "#root/pc/units/divideUnit";
import { MassUnit } from "#root/pc/units/massUnits";
import { VolumeUnit } from "#root/pc/units/volumeUnit";

type Identifiers = {};

// m = t*v où t = concentration
const getCalculateVolumetricMassQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const type = randint(1, 4);
  let m = 0;
  let t = 0;
  let v = 0;
  let mMeasure;
  let tMeasure;
  let vMeasure;
  let instruction = "";
  let answer = "";

  const tUnit = new DivideUnit(MassUnit.g, VolumeUnit.mL);
  switch (type) {
    case 1:
      //find t
      m = randfloat(50, 400, 1);
      v = randfloat(50, 400, 1);
      mMeasure = new Measure(m, 0, MassUnit.g);
      vMeasure = new Measure(v, 0, VolumeUnit.mL);
      answer = round(m / v, 1).frenchify();
      instruction = `Un liquide de volume $${vMeasure.toTex({
        notScientific: true,
      })}$ a une masse de $${mMeasure.toTex({
        notScientific: true,
      })}$. Quel est la masse volumique de ce liquide, en $${tUnit.toTex()}$ ?`;
      break;
    case 2:
      //find m
      t = randfloat(1, 20, 1);
      v = randfloat(50, 400, 1);
      tMeasure = new Measure(t, 0, tUnit);
      vMeasure = new Measure(v, 0, VolumeUnit.mL);
      answer = round(t * v, 1).frenchify();
      instruction = `Un liquide de volume $${vMeasure.toTex({
        notScientific: true,
      })}$ a une masse volumique de $${tMeasure.toTex({
        notScientific: true,
      })}$. Quel est la masse de ce liquide, en $${MassUnit.g.toTex()}$ ?`;
      break;
    case 3:
      //find v
      t = randfloat(1, 20, 1);
      m = randfloat(50, 400, 1);
      tMeasure = new Measure(t, 0, tUnit);
      mMeasure = new Measure(m, 0, MassUnit.g);
      answer = round(m / t, 1).frenchify();
      instruction = `Un liquide de masse $${mMeasure.toTex({
        notScientific: true,
      })}$ a une masse volumique de $${tMeasure.toTex({
        notScientific: true,
      })}$. Quel est le volume de ce liquide, en $${VolumeUnit.mL.toTex()}$ ?`;
      break;
  }

  //un lique de volume v a une masse volumique de t, calculer m
  //un liquide d'un volume de v a une masse de m, calculer t
  const question: Question<Identifiers> = {
    answer,
    instruction,
    keys: [],
    answerFormat: "tex",
    identifiers: { m, t, v },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(1, 50, 1).frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};
export const calculateVolumetricMass: Exercise<Identifiers> = {
  id: "calculateVolumetricMass",
  connector: "=",
  label: "Utiliser la formule $m = t\\times V$",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Corps purs et mélanges"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateVolumetricMassQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Chimie",
};
