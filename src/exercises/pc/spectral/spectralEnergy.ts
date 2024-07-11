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
  wavelengths: Measure[];
  targetColor: "bleue" | "verte" | "rouge";
  energy: Measure;
};

const wavelengths = {
  bleue: { min: 400, max: 455 },
  verte: { min: 500, max: 560 },
  rouge: { min: 610, max: 660 },
};

const h = new Measure(
  planckConstant.value.significantPart,
  planckConstant.value.exponent,
);
const c = new Measure(
  lightSpeed.value.significantPart,
  lightSpeed.value.exponent,
);

const images = [
  `https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/emissionSpectrum1.png`,
  `https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/emissionSpectrum2.png`,
  `https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/emissionSpectrum3.png`,
  `https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/emissionSpectrum4.png`,
  `https://heureuxhasarddocsbucket.s3.eu-west-3.amazonaws.com/xpliveV2/activities/quizzes/generator/emissionSpectrum5.png`,
];

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

  const instruction = `Vous travaillez dans un laboratoire de spectroscopie et vous êtes en train de réaliser une analyse des transitions électroniques d'un échantillon. \n
  Vous avez utilisé un spectromètre pour mesurer les longueurs d'onde des raies d'émission de la lumière émise par l'échantillon. \n
  Les mesures que vous avez obtenues sont les suivantes :

  - Longueur d'onde de la lumière bleue : $\\lambda_{bleue} = ${wavelengthBlueNm}\\ nm$,
  - Longueur d'onde de la lumière verte : $\\lambda_{verte} = ${wavelengthGreenNm}\\ nm$,
  - Longueur d'onde de la lumière rouge : $\\lambda_{rouge} = ${wavelengthRedNm}\\ nm$.

  ![](${images[randint(0, images.length)]})
  
  En utilisant ces données, calculez l'énergie de transition en joules pour la lumière ${targetColor} émise par l'échantillon.`;

  const hint = `Rappelez-vous la relation entre l'énergie et la longueur d'onde : $E = \\frac{hc}{\\lambda}$. Rappel des constantes : 
  - Constante de Planck : $h = ${h.toSignificant(2).toTex()}$
  - Vitesse de la lumière : $c = ${c.toSignificant(2).toTex()}$`;
  const correction = `La relation entre l'énergie et la longueur d'onde est donnée par :
  $E = \\frac{hc}{\\lambda}$. En utilisant les valeurs fournies pour $h$, $c$, et $\\lambda_{${targetColor}}$ (en mètres), vous pouvez résoudre pour l'énergie :
  $E_{${targetColor}} = \\frac{${h.toTex({ scientific: 2 })} \\times ${c.toTex({
    scientific: 2,
  })}}{${
    targetColor === "bleue"
      ? wavelengthBlue.toTex({
          scientific: 2,
        })
      : targetColor === "rouge"
      ? wavelengthRed.toTex({ scientific: 2 })
      : wavelengthGreen.toTex({ scientific: 2 })
  }} = ${targetEnergy.toTex()}\\ J$.`;

  const question: Question<Identifiers> = {
    answer: targetEnergy.toTex(),
    instruction,
    hint,
    correction,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      wavelengths: [wavelengthBlue, wavelengthGreen, wavelengthRed],
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
    new Measure(randfloat(0.1, 10, 2), -19).toSignificant(2),
    energy.times(new Measure(1, -8)),
    energy.times(new Measure(1, 34)),
  ];

  incorrectValues.forEach((value) => {
    tryToAddWrongProp(propositions, value.toTex());
  });

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Measure(randfloat(0.1, 10, 2), -19).toSignificant(2).toTex(),
    );
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, energy, wavelengths, targetColor },
) => {
  const energies = {
    bleue: h.times(c).divide(wavelengths[0]),
    verte: h.times(c).divide(wavelengths[1]),
    rouge: h.times(c).divide(wavelengths[2]),
  };

  const targetEnergy = energies[targetColor];

  const validAnswer1 = targetEnergy.toSignificant(1).toTex();
  const validAnswer2 = targetEnergy.toSignificant(2).toTex();
  const validAnswer3 = targetEnergy.toSignificant(3).toTex();

  let latexs = [];
  latexs.push(validAnswer1, validAnswer2, validAnswer3);
  return latexs.includes(ans);
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
