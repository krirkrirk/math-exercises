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
import { randint } from "#root/math/utils/random/randint";
import { round, roundSignificant } from "#root/math/utils/round";
import { random } from "#root/utils/alea/random";
import { randfloat } from "#root/math/utils/random/randfloat";
import { coinFlip } from "#root/utils/alea/coinFlip";

const powers = [15, 18, 50, 25, 65, 66, 7.5, 10]; // Puissances en watts
const durations = [60, 3600, 86400, 604800]; // Durées en secondes (1 min, 1 h, 1 jour, 1 semaine)

type Identifiers = { power: number; seconds: number; energy: number };

const getElectricPowerOrEnergyQuestion: QuestionGenerator<Identifiers> = () => {
  const power = random(powers);
  const seconds = random(durations);
  const energy = power * seconds;

  const isCalculatingEnergy = coinFlip();

  const questionText = isCalculatingEnergy
    ? `Un appareil a une puissance de $P = ${frenchify(
        power,
      )}\\ \\text{W}$ et fonctionne pendant $t = ${frenchify(
        seconds,
      )}\\ \\text{s}$. Calculez l'énergie électrique $E$ en $\\text{J}$ fournie par cet appareil.`
    : `Un appareil consomme une énergie $E = ${frenchify(
        energy,
      )}\\ \\text{J}$ en $t = ${frenchify(
        seconds,
      )}\\ \\text{s}$. Calculez la puissance $P$ en $\\text{W}$ de cet appareil.`;

  const answer = isCalculatingEnergy ? energy : round(energy / seconds, 2);

  const hint = `La relation entre l'énergie électrique, la puissance et le temps est donnée par la formule :
    $$
    E = P \\times t
    $$
    Réarrangez cette formule pour isoler la variable à trouver.`;

  const correction = `La relation entre l'énergie électrique, la puissance et le temps est :
    $$
    E = P \\times t
    $$

Pour résoudre ce problème, nous devons réorganiser la formule pour isoler la variable inconnue.

${
  isCalculatingEnergy
    ? `$$E = P \\times t = ${frenchify(power)} \\times ${frenchify(
        seconds,
      )} = ${frenchify(answer)}\\ \\text{J}$$`
    : `$$P = \\frac{E}{t} = \\frac{${frenchify(energy)}}{${frenchify(
        seconds,
      )}} = ${frenchify(answer)}\\ \\text{W}$$`
}`;

  const question: Question<Identifiers> = {
    answer: answer.toTree().toTex(),
    instruction: questionText,
    hint,
    correction,
    keys: ["P", "E", "t"],
    answerFormat: "tex",
    identifiers: { power, seconds, energy },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, power, seconds, energy },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const wrongAnswers = [
    roundSignificant(power * seconds * 0.5, 2),
    roundSignificant(energy * 0.1, 2),
    roundSignificant(seconds / power, 2),
    roundSignificant(power / seconds, 2),
  ];

  wrongAnswers.forEach((wrongAnswer) => {
    tryToAddWrongProp(propositions, wrongAnswer);
  });

  while (propositions.length < n) {
    tryToAddWrongProp(propositions, randfloat(0.1, 5, 2).toTree().toTex());
  }

  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const electricPowerOrEnergyCalculation: Exercise<Identifiers> = {
  id: "electricPowerOrEnergyCalculation",
  label: "Calculer la puissance ou l'énergie électrique",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getElectricPowerOrEnergyQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
  hasHintAndCorrection: true,
};
