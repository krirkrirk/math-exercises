import {
  shuffleProps,
  Exercise,
  Proposition,
  Question,
  tryToAddWrongProp,
  QuestionGenerator,
  QCMGenerator,
  addValidProp,
  VEA,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { randint } from "#root/math/utils/random/randint";
import { SubstractNode } from "#root/tree/nodes/operators/substractNode";
import { alignTex } from "#root/utils/alignTex";
import { randomLetter } from "#root/utils/randomLetter";

type Identifiers = {
  A: number[];
  B: number[];
};

const getVectorCoordinatesFromTwoPointsQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const A = [randint(-9, 9), randint(-9, 9)];
  const B = [randint(-9, 9), randint(-9, 9)];
  const startLetter = randomLetter(true);
  let endLetter = "";
  do {
    endLetter = randomLetter(true);
  } while (endLetter === startLetter);

  const answer = `\\left(${B[0] - A[0]};${B[1] - A[1]}\\right)`;

  const question: Question<Identifiers> = {
    answer,
    instruction: `Soit $${startLetter}\\left(${A[0]};${A[1]}\\right)$ et $${endLetter}\\left(${B[0]};${B[1]}\\right)$. Quelles sont les coordonnées du vecteur $\\overrightarrow{${startLetter}${endLetter}}$ ?`,
    keys: ["semicolon"],
    answerFormat: "tex",
    hint: `Si $A(x_A;y_A)$ et $B(x_B;y_B)$ sont deux points, alors le vecteur $\\overrightarrow{AB}$ a pour coordonnées : 
    
$$
\\overrightarrow{AB} \\begin{pmatrix} x_B - x_A \\\\ y_B - y_A \\end{pmatrix}
$$`,
    correction: `On a : 
    
${alignTex([
  [
    `\\overrightarrow{${startLetter}${endLetter}}  \\begin{pmatrix}
          ${new SubstractNode(B[0].toTree(), A[0].toTree()).toTex()}
        \\\\ ${new SubstractNode(
          B[1].toTree(),
          A[1].toTree(),
        ).toTex()}\\end{pmatrix} `,
    "=",
    `\\begin{pmatrix}${B[0] - A[0]} \\\\ ${B[1] - A[1]}\\end{pmatrix}`,
  ],
])}`,
    identifiers: { A, B },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer, A, B }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  tryToAddWrongProp(
    propositions,
    `\\left(${A[0] - B[0]};${A[1] - B[1]}\\right)`,
  );
  tryToAddWrongProp(
    propositions,
    `\\left(${A[1] - A[0]};${B[1] - B[0]}\\right)`,
  );
  tryToAddWrongProp(
    propositions,
    `\\left(${B[1] - B[0]};${A[1] - A[0]}\\right)`,
  );

  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      `\\left(${randint(-10, 10)};${randint(-10, 10)}\\right)`,
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return [ans, ans.replace(",", ";"), "\\left(" + ans + "\\right)"].includes(
    answer,
  );
};
export const vectorCoordinatesFromTwoPoints: Exercise<Identifiers> = {
  id: "vectorCoordinatesFromTwoPoints",
  connector: "=",
  label: "Déterminer les coordonnées d'un vecteur à partir de deux points",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Vecteurs"],
  generator: (nb: number) =>
    getDistinctQuestions(getVectorCoordinatesFromTwoPointsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
