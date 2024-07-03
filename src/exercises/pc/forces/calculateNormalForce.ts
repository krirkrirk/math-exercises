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
import { earthGravity } from "#root/pc/constants/gravity";
import { random } from "#root/utils/random";

const theta = Math.PI / 4;
const g = +earthGravity.measure.significantPart.toFixed(2);

type Identifiers = {
  mass: number;
  isAsking: string;
};

const getCalculateNormalForceQuestion: QuestionGenerator<Identifiers> = () => {
  const exo = generateExercise();
  const question: Question<Identifiers> = {
    answer: exo.answer,
    instruction: exo.instruction,
    hint: exo.hint,
    correction: exo.correction,
    coords: [-2, 10, -2, 10],
    keys: [],
    answerFormat: "tex",
    identifiers: { mass: exo.mass, isAsking: exo.isAsking },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, mass, isAsking },
) => {
  const propositions: Proposition[] = [];
  const correctAns = getAnswer(isAsking, mass);
  addValidProp(propositions, answer);
  generatePropositions(mass, isAsking).forEach((value) =>
    tryToAddWrongProp(propositions, value),
  );
  while (propositions.length < n) {
    let random = randfloat(correctAns - 20, correctAns + 21, 2, [correctAns]);
    tryToAddWrongProp(propositions, random.frenchify());
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, mass, isAsking }) => {
  const scientificAnswer = getAnswer(isAsking, mass).toScientific(2).toTex();
  return [answer, scientificAnswer].includes(ans);
};

const generatePropositions = (mass: number, isAsking: string): string[] => {
  const isNotAsking =
    isAsking === "réaction normale" ? "frottement" : "réaction normale";
  const first = (-getAnswer(isNotAsking, mass)).frenchify();
  return [first];
};

const generateExercise = () => {
  const mass = randint(10, 31);
  const isAsking = random(["réaction normale", "frottement"]);
  const instruction = `Soit un système représenté par un bloc en équilibre sur un plan incliné, soumis à trois forces :

- Le poids du bloc $P$. 
- La force de réaction normale $R$.
- La force de frottement $F$.

Les données du problème sont les suivantes :

- La masse du bloc : $m = ${mass}\\ kg$
- L'angle du plan incliné par rapport à l'horizontale : $\\alpha = 45°$

Calculer la force de ${isAsking} en $N$, arrondie au centième.`;
  const answer = getAnswer(isAsking, mass).frenchify();
  const hint = `Rappel : la somme des forces exercées sur un objet en équilibre est nulle $\\sum\\overrightarrow{F} = 0$`;
  const correction = getCorrection(isAsking, answer);
  return {
    instruction,
    answer,
    hint,
    correction,
    isAsking,
    mass,
  };
};

const getAnswer = (isAsking: string, mass: number): number => {
  const weight = mass * g;
  return isAsking === "réaction normale"
    ? +(Math.cos(theta) * weight).toFixed(2)
    : -(Math.sin(theta) * weight).toFixed(2);
};

const getCorrection = (isAsking: string, answer: string) => {
  return isAsking === "réaction normale"
    ? `1 - Calculer la composante perpendicualire du poids : $P_{\\perp} = \\cos(45°) \\times m \\cdot g$
  
  2 - $R = P_{\\perp}\\ \\Rightarrow\\ R = ${answer}\\ N$`
    : `1 - Calculer la composante parallèle du poids : $P_{\\parallel} = \\sin(45°) \\times m \\cdot g$
  
  2 - $F = -P_{\\perp}\\ \\Rightarrow\\ F = ${answer}\\ N$`;
};

export const calculateNormalForce: Exercise<Identifiers> = {
  id: "calculateNormalForce",
  label: "Calcul de force exercée sur un objet statique",
  levels: ["1reSpé", "TermSpé"],
  isSingleStep: true,
  sections: ["Forces"],
  generator: (nb: number) =>
    getDistinctQuestions(getCalculateNormalForceQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  hasGeogebra: true,
  subject: "Physique",
};
