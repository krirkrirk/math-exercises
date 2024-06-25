import { frenchify } from "#root/math/utils/latex/frenchify";
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
import { round } from "#root/math/utils/round";
import { Measure } from "#root/pc/measure/measure";
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";
import { lightSpeed, planckConstant } from "#root/pc/constants/quantic";

type Identifiers = {
  wavelengthBlue: Measure;
  wavelengthGreen: Measure;
  wavelengthRed: Measure;
  targetColor: "bleue" | "verte" | "rouge";
  energy: Measure;
};

const wavelengths = {
  bleue: { min: 445, max: 455 },
  verte: { min: 540, max: 560 },
  rouge: { min: 640, max: 660 },
};

const h = new Measure(
  planckConstant.value.significantPart,
  planckConstant.value.exponent,
);
const c = new Measure(
  lightSpeed.value.significantPart,
  lightSpeed.value.exponent,
);

const getSpectralEnergyQuestion: QuestionGenerator<Identifiers> = () => {
  const wavelengthBlueNm = randint(
    wavelengths.bleue.min,
    wavelengths.bleue.max,
  );
  const wavelengthGreenNm = randint(
    wavelengths.verte.min,
    wavelengths.verte.max,
  );
  const wavelengthRedNm = randint(wavelengths.rouge.min, wavelengths.rouge.max);

  const wavelengthBlue = new Measure(wavelengthBlueNm, -9);
  const wavelengthGreen = new Measure(wavelengthGreenNm, -9);
  const wavelengthRed = new Measure(wavelengthRedNm, -9);

  const energies = {
    bleue: h.times(c).divide(wavelengthBlue).toSignificant(2),
    verte: h.times(c).divide(wavelengthGreen).toSignificant(2),
    rouge: h.times(c).divide(wavelengthRed).toSignificant(2),
  };

  const colors: ("bleue" | "verte" | "rouge")[] = ["bleue", "verte", "rouge"];
  const targetColor = colors[randint(0, colors.length - 1)];
  const targetEnergy = energies[targetColor];

  const instruction = `Vous avez mesuré les données suivantes pour une lumière :\n
  - Longueur d'onde bleue : $\\lambda_{bleue} = ${wavelengthBlueNm}\\ nm$,\n
  - Longueur d'onde verte : $\\lambda_{verte} = ${wavelengthGreenNm}\\ nm$,\n
  - Longueur d'onde rouge : $\\lambda_{rouge} = ${wavelengthRedNm}\\ nm$.\n
  À partir de ces données, déterminez l'énergie en joules de la lumière ${targetColor}.`;

  const hint = `Rappelez-vous la relation entre l'énergie et la longueur d'onde : $E = \\frac{hc}{\\lambda}$.
  Réorganisez cette formule pour isoler la variable à trouver.`;
  const correction = `La relation entre l'énergie et la longueur d'onde est donnée par :
  $E = \\frac{hc}{\\lambda}$. En utilisant les valeurs fournies pour $h$, $c$, et $\\lambda_{${targetColor}}$ (en mètres), vous pouvez résoudre pour l'énergie :
  $E_{${targetColor}} = \\frac{${h.toTex({ scientific: 2 })} \\times ${c.toTex({
    scientific: 2,
  })}}{${wavelengthBlue.toTex({
    scientific: 2,
  })}} = ${targetEnergy.toTex()}\\ J$.`;

  const question: Question<Identifiers> = {
    answer: targetEnergy.toTex(),
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      wavelengthBlue,
      wavelengthGreen,
      wavelengthRed,
      targetColor,
      energy: targetEnergy,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, energy }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const incorrectValues = [
    new Measure(
      randfloat(0.5 * energy.evaluate(), 0.9 * energy.evaluate()),
      0,
    ).toSignificant(2),
    new Measure(
      randfloat(1.1 * energy.evaluate(), 1.5 * energy.evaluate()),
      0,
    ).toSignificant(2),
  ];

  incorrectValues.forEach((value) => {
    tryToAddWrongProp(propositions, value.toTex());
  });

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Measure(randfloat(0.1, 10), 0).toSignificant(2).toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const SpectralEnergyExercise: Exercise<Identifiers> = {
  id: "spectralEnergy",
  label: "Calculer l'énergie d'une lumière à partir de la longueur d'onde",
  levels: ["TermSpé"],
  isSingleStep: true,
  sections: ["Quantique"],
  generator: (nb: number) =>
    getDistinctQuestions(getSpectralEnergyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
