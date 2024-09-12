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
import { randfloat } from "#root/math/utils/random/randfloat";
import { randint } from "#root/math/utils/random/randint";

type Identifiers = {
  mass: number;
  specificHeat: number;
  initialTemp: number;
  finalTemp: number;
  variable: "E_th" | "m" | "c" | "deltaT";
};

const getThermalEnergyTransferCalculationQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const mass = randfloat(0.1, 5, 2); // Masse en kg
  const specificHeat = randfloat(400, 3000, 2); // Capacité thermique massique en J·kg⁻¹·K⁻¹
  const initialTemp = randfloat(283.15, 303.15, 2); // Température initiale en K (10 à 30 °C)
  const finalTemp = randfloat(323.15, 373.15, 2); // Température finale en K (50 à 100 °C)
  const deltaT = finalTemp - initialTemp;

  const variableIndex = randint(0, 4);
  const variables = ["E_th", "m", "c", "deltaT"] as const;
  const variable = variables[variableIndex];

  let questionText, answer;
  switch (variable) {
    case "E_th":
      questionText = `Vous êtes dans un laboratoire et vous chauffez un corps de masse $m = ${frenchify(
        mass,
      )}\\ \\text{kg}$ avec une capacité thermique massique $c = ${frenchify(
        specificHeat,
      )}\\ \\text{J}·\\text{kg}^{-1}·\\text{K}^{-1}$. La température initiale du corps est $\\theta_i = ${frenchify(
        initialTemp,
      )}\\ \\text{K}$ et sa température finale est $\\theta_f = ${frenchify(
        finalTemp,
      )}\\ \\text{K}$. Déterminez l'énergie thermique $E_{th}$ en $\\text{J}$ reçue par le corps.`;
      answer = round(mass * specificHeat * deltaT, 2);
      break;
    case "m":
      questionText = `Vous êtes dans un laboratoire et vous chauffez un corps avec une capacité thermique massique $c = ${frenchify(
        specificHeat,
      )}\\ \\text{J}·\\text{kg}^{-1}·\\text{K}^{-1}$. La température initiale du corps est $\\theta_i = ${frenchify(
        initialTemp,
      )}\\ \\text{K}$ et sa température finale est $\\theta_f = ${frenchify(
        finalTemp,
      )}\\ \\text{K}$. L'énergie thermique reçue par le corps est $E_{th} = ${frenchify(
        round(mass * specificHeat * deltaT, 2),
      )}\\ \\text{J}$. Déterminez la masse $m$ en $\\text{kg}$ du corps.`;
      answer = round(
        (mass * specificHeat * deltaT) / (specificHeat * deltaT),
        2,
      );
      break;
    case "c":
      questionText = `Vous êtes dans un laboratoire et vous chauffez un corps de masse $m = ${frenchify(
        mass,
      )}\\ \\text{kg}$. La température initiale du corps est $\\theta_i = ${frenchify(
        initialTemp,
      )}\\ \\text{K}$ et sa température finale est $\\theta_f = ${frenchify(
        finalTemp,
      )}\\ \\text{K}$. L'énergie thermique reçue par le corps est $E_{th} = ${frenchify(
        round(mass * specificHeat * deltaT, 2),
      )}\\ \\text{J}$. Déterminez la capacité thermique massique $c$ en $\\text{J}·\\text{kg}^{-1}·\\text{K}^{-1}$ du corps.`;
      answer = round((mass * specificHeat * deltaT) / (mass * deltaT), 2);
      break;
    case "deltaT":
      questionText = `Vous êtes dans un laboratoire et vous chauffez un corps de masse $m = ${frenchify(
        mass,
      )}\\ \\text{kg}$ avec une capacité thermique massique $c = ${frenchify(
        specificHeat,
      )}\\ \\text{J}·\\text{kg}^{-1}·\\text{K}^{-1}$. L'énergie thermique reçue par le corps est $E_{th} = ${frenchify(
        round(mass * specificHeat * deltaT, 2),
      )}\\ \\text{J}$. Déterminez la variation de température $\\Delta\\theta$ en $\\text{K}$ du corps.`;
      answer = round((mass * specificHeat * deltaT) / (mass * specificHeat), 2);
      break;
  }

  const hint = `Le transfert d'énergie thermique se calcule par la relation :
    $$
    E_{th} = m \\times c \\times (\\theta_f - \\theta_i)
    $$
    Réarrangez cette formule pour isoler la variable à trouver.`;

  const correction = `La formule du transfert d'énergie thermique est :
    $$
    E_{th} = m \\times c \\times (\\theta_f - \\theta_i)
    $$
  
Pour résoudre ce problème, nous devons réorganiser la formule pour isoler la variable inconnue.
  
${
  variable === "E_th"
    ? `$$E_{th} = m \\times c \\times (\\theta_f - \\theta_i) = ${frenchify(
        mass,
      )} \\times ${frenchify(specificHeat)} \\times (${frenchify(
        finalTemp,
      )} - ${frenchify(initialTemp)}) = ${frenchify(answer)}\\ \\text{J}$$`
    : variable === "m"
    ? `$$m = \\frac{E_{th}}{c \\times (\\theta_f - \\theta_i)} = \\frac{${frenchify(
        mass * specificHeat * deltaT,
      )}}{${frenchify(specificHeat)} \\times (${frenchify(
        finalTemp,
      )} - ${frenchify(initialTemp)})} = ${frenchify(answer)}\\ \\text{kg}$$`
    : variable === "c"
    ? `$$c = \\frac{E_{th}}{m \\times (\\theta_f - \\theta_i)} = \\frac{${frenchify(
        mass * specificHeat * deltaT,
      )}}{${frenchify(mass)} \\times (${frenchify(finalTemp)} - ${frenchify(
        initialTemp,
      )})} = ${frenchify(answer)}\\ \\text{J}·\\text{kg}^{-1}·\\text{K}^{-1}$$`
    : `$$\\Delta\\theta = \\frac{E_{th}}{m \\times c} = \\frac{${frenchify(
        mass * specificHeat * deltaT,
      )}}{${frenchify(mass)} \\times ${frenchify(specificHeat)}} = ${frenchify(
        answer,
      )}\\ \\text{K}$$`
}`;

  const question: Question<Identifiers> = {
    answer: answer.toTree().toTex(),
    instruction: questionText,
    hint,
    correction,
    keys: ["timesTenPower"],
    answerFormat: "tex",
    identifiers: {
      mass,
      specificHeat,
      initialTemp,
      finalTemp,
      variable,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, mass, specificHeat, initialTemp, finalTemp, variable },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongAnswers = [
    variable === "E_th"
      ? round(mass * specificHeat * (finalTemp + initialTemp), 2)
      : round(mass * specificHeat * (finalTemp - initialTemp), 2),
    variable === "m"
      ? round(
          (mass * specificHeat * (finalTemp - initialTemp)) /
            (specificHeat * finalTemp),
          2,
        )
      : round(
          (mass * specificHeat * (finalTemp - initialTemp)) /
            (specificHeat * initialTemp),
          2,
        ),
    variable === "c"
      ? round(
          (mass * specificHeat * (finalTemp - initialTemp)) /
            (mass * finalTemp),
          2,
        )
      : round(
          (mass * specificHeat * (finalTemp - initialTemp)) /
            (mass * initialTemp),
          2,
        ),
    variable === "deltaT"
      ? round(
          (mass * specificHeat * (finalTemp + initialTemp)) /
            (mass * specificHeat),
          2,
        )
      : round(
          (mass * specificHeat * (finalTemp - initialTemp)) /
            (mass * specificHeat),
          2,
        ),
  ];

  wrongAnswers.forEach((wrongAnswer) => {
    tryToAddWrongProp(propositions, wrongAnswer.toTree().toTex());
  });

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(0.1, 5, 2).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (
  ans,
  { answer, mass, specificHeat, initialTemp, finalTemp, variable },
) => {
  let validanswer;
  const deltaT = finalTemp - initialTemp;
  switch (variable) {
    case "E_th":
      validanswer = round(mass * specificHeat * deltaT, 2);
      break;
    case "m":
      validanswer = round(
        (mass * specificHeat * deltaT) / (specificHeat * deltaT),
        2,
      );
      break;
    case "c":
      validanswer = round((mass * specificHeat * deltaT) / (mass * deltaT), 2);
      break;
    case "deltaT":
      validanswer = round(
        (mass * specificHeat * deltaT) / (mass * specificHeat),
        2,
      );
      break;
  }

  const latexs = [
    ...validanswer.toTree().toAllValidTexs(),
    validanswer.toScientific(2).toTex(),
    validanswer.toScientific(1).toTex(),
    validanswer.toScientific(3).toTex(),
  ];

  return latexs.includes(ans);
};

export const thermalEnergyTransferCalculation: Exercise<Identifiers> = {
  id: "thermalEnergyTransferCalculation",
  label: "Calculer l'énergie de transfert thermique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Thermodynamique"],
  generator: (nb: number) =>
    getDistinctQuestions(getThermalEnergyTransferCalculationQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  hasHintAndCorrection: true,
};
