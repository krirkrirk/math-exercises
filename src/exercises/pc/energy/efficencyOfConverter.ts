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
import { frenchify } from "#root/math/utils/latex/frenchify";
import { randint } from "#root/math/utils/random/randint";
import { Measure } from "#root/pc/measure/measure";
import { WattUnit } from "#root/pc/units/wattUnit";

type Identifiers = {
  entry: number;
  out: number;
};

const getEfficencyOfConverterQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = getExercise();

  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    hint: exo.hint,
    correction: exo.correction,
    keys: [],
    answerFormat: "tex",
    identifiers: { entry: exo.entry, out: exo.out },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, entry, out },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  generatePropositions(entry, out).forEach((value) =>
    tryToAddWrongProp(propositions, value + ""),
  );
  let random;
  while (propositions.length < n) {
    random = randint(+answer - 10, +answer + 20, [+answer]);
    tryToAddWrongProp(propositions, random + "");
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

const generatePropositions = (entry: number, out: number): number[] => {
  const first = Math.floor((entry * 100) / out) * 100;
  return [first];
};

const getExercise = () => {
  const entry = randint(3, 8);
  const entryMeasure = new Measure(entry * 100, 0, WattUnit.W);
  const out = randint(1, entry) * 100;
  const outMeasure = new Measure(out, 0, WattUnit.W);
  const instruction = `Un convertisseur reçoit une puissance d'entrée de $${entryMeasure.toTex(
    { notScientific: true },
  )}$ et fournit une puissance exploitable de $${outMeasure.toTex({
    notScientific: true,
  })}$. 
  
  Calculez le rendement du convertisseur arrondie au centiéme. Exprimez votre réponse en pourcentage.`;

  const answer = `${Math.floor(out / entry)}`;

  const hint = `Un convertisseur d'énergie a pour rendement, noté $\\eta$, une grandeur sans dimension qui mesure l'efficacité de sa conversion d'énergie.
  
  Ce rendement est défini par la formule suivante :
  - $\\eta = \\frac{P_{exploitable}}{P_{entrée}}$`;

  const correction = `Appliquer la formule $\\eta = \\frac{P_{exploitable}}{P_{entrée}}$ : 
  
  - $\\eta = \\frac{${outMeasure.toTex({
    notScientific: true,
  })}}{${entryMeasure.toTex({
    notScientific: true,
  })}} \\times 100 \\Rightarrow \\eta=${answer}\\%$`;
  return {
    instruction,
    answer,
    hint,
    correction,
    entry,
    out,
  };
};

export const efficencyOfConverter: Exercise<Identifiers> = {
  id: "efficencyOfConverter",
  label: "Calcul du rendement d'un convertisseur",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Électricité"],
  generator: (nb: number) =>
    getDistinctQuestions(getEfficencyOfConverterQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Physique",
};
