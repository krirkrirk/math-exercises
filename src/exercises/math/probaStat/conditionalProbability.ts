import { randint } from "#root/math/utils/random/randint";
import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
import { round } from "#root/math/utils/round";
import { shuffle } from "#root/utils/shuffle";
import { alignTex } from "#root/utils/latex/alignTex";
type Identifiers = {
  flip: number;
  pA?: number;
  pB?: number;
  pAB?: number;
  pA_B?: number;
  pB_A?: number;
};

const getConditionalProbability: QuestionGenerator<Identifiers> = () => {
  let pA: number | undefined,
    pB: number | undefined,
    pAB: number | undefined,
    pA_B: number | undefined,
    pB_A: number | undefined;
  let pAStr: string | undefined,
    pBStr: string | undefined,
    pABStr: string | undefined,
    pA_BStr: string | undefined,
    pB_AStr: string | undefined;

  const flip = randint(1, 7);

  let instruction = `On considère deux événements $A$ et $B$ tels que `;
  let startStatement = "";
  let answer = "";
  let correction = "";

  switch (flip) {
    case 1: {
      pA = randint(2, 100);
      pAB = randint(1, pA);
      pAStr = (pA / 100).frenchify();
      pABStr = (pAB / 100).frenchify();
      pB_AStr = round(pAB / pA, 2).frenchify();
      instruction += `$P(A) = ${pAStr}\\ $ et $\\ P(A \\cap B) = ${pABStr}$.$\\\\$Déterminer $P_A(B)$ (arrondir au centième).`;
      startStatement = `P_A(B)`;
      answer = pB_AStr;
      correction = `
On sait que : 

$$
P_A(B) = \\frac{P(A \\cap B)}{P(A)}
$$

On a donc : 

$$
P_A(B) = \\frac{${pABStr}}{${pAStr}} \\approx ${answer}
$$
      `;
      break;
    }
    case 2: {
      pB = randint(2, 100);
      pAB = randint(1, pB);
      pBStr = (pB / 100).frenchify();
      pABStr = (pAB / 100).frenchify();
      pA_BStr = round(pAB / pB, 2).frenchify();
      instruction += `$P(B) = ${pBStr}\\ $ et $\\ P(B \\cap A) = ${pABStr}$.$\\\\$Déterminer $P_B(A)$ (arrondir au centième).`;
      startStatement = `P_B(A)`;
      answer = pA_BStr;
      correction = `
On sait que : 

$$
P_B(A) = \\frac{P(A \\cap B)}{P(B)}
$$

On a donc : 

$$
P_B(A) = \\frac{${pABStr}}{${pBStr}} \\approx ${answer}
$$
      `;
      break;
    }
    case 3: {
      pA = randint(2, 100);
      pAStr = (pA / 100).frenchify();
      pB_A = randint(1, pA);
      pB_AStr = (pB_A / 100).frenchify();
      pAB = round((pB_A * pA) / 10000, 2);
      pABStr = pAB.frenchify();
      instruction += `$P(A) = ${pAStr}\\ $ et $\\ P_A(B) = ${pB_AStr}$.$\\\\$Déterminer $P(A \\cap B)$ (arrondir au centième).`;
      startStatement = `P(A \\cap B)`;
      answer = pABStr;
      correction = `
On sait que : 
      
$$
P_A(B) = \\frac{P(A \\cap B)}{P(A)}
$$

On a donc : 

${alignTex([
  ["P(A \\cap B)", "=", "P_A(B)\\times P(A)"],
  ["", "=", `${pB_AStr}\\times ${pAStr}`],
  ["", "\\approx", answer],
])}
            `;
      break;
    }
    case 4: {
      pB = randint(2, 100);
      pBStr = (pB / 100).frenchify();
      pA_B = randint(1, pB);
      pA_BStr = (pA_B / 100).frenchify();
      pAB = round((pA_B * pB) / 10000, 2);
      pABStr = pAB.frenchify();
      instruction += `$P(B) = ${pBStr}\\ $ et $\\ P_B(A) = ${pA_BStr}$.$\\\\$Déterminer $P(A \\cap B)$ (arrondir au centième).`;
      startStatement = `P(A \\cap B)`;
      answer = pABStr;
      correction = `
On sait que : 
      
$$
P_B(A) = \\frac{P(A \\cap B)}{P(B)}
$$

On a donc : 

${alignTex([
  ["P(A \\cap B)", "=", "P_B(A)\\times P(B)"],
  ["", "=", `${pA_BStr}\\times ${pBStr}`],
  ["", "\\approx", answer],
])}
            `;
      break;
    }
    case 5: {
      pA_B = randint(1, 100);
      pAB = randint(1, pA_B);
      pABStr = (pAB / 100).frenchify();
      pA_BStr = (pA_B / 100).frenchify();
      pB = round(pAB / pA_B, 2);
      pBStr = pB.frenchify();
      instruction += `$P(A \\cap B) = ${pABStr}\\ $ et $\\ P_B(A) = ${pA_BStr}$.$\\\\$Déterminer $P(B)$ (arrondir au centième).`;
      startStatement = `P(B)`;
      answer = pBStr;
      correction = `
On sait que : 
      
$$
P_B(A) = \\frac{P(A \\cap B)}{P(B)}
$$

On a donc : 

${alignTex([
  ["P(B)", "=", "\\frac{P(A\\cap B)}{P_B(A)}"],
  ["", "=", `\\frac{${pABStr}}{${pA_BStr}}`],
  ["", "\\approx", answer],
])}
            `;
      break;
    }
    case 6: {
      pB_A = randint(1, 100);
      pAB = randint(1, pB_A);
      pABStr = (pAB / 100).frenchify();
      pB_AStr = (pB_A / 100).frenchify();
      pA = round(pAB / pB_A, 2);
      pAStr = pA.frenchify();
      instruction += `$P(A \\cap B) = ${pABStr}\\ $ et $\\ P_A(B) = ${pB_AStr}$.$\\\\$Déterminer $P(A)$ (arrondir au centième).`;
      startStatement = `P(A)`;
      answer = pAStr;
      correction = `
On sait que : 
      
$$
P_A(B) = \\frac{P(A \\cap B)}{P(A)}
$$

On a donc : 

${alignTex([
  ["P(A)", "=", "\\frac{P(A\\cap B)}{P_A(B)}"],
  ["", "=", `\\frac{${pABStr}}{${pB_AStr}}`],
  ["", "\\approx", answer],
])}
            `;
      break;
    }
  }

  const question: Question<Identifiers> = {
    instruction,
    startStatement,
    answer,
    keys: ["p", "cap", "underscore"],
    answerFormat: "tex",
    identifiers: { flip, pA, pAB, pB, pA_B, pB_A },
    hint: `Pour deux événements $M$ et $N$, on a: 
    
$$
P_M(N) = \\frac{P(M \\cap N)}{P(M)}
$$
`,

    correction,
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (n, { answer }) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      (Math.floor(Math.random() * 100) / 100 + "").replace(".", ","),
    );
  }

  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer }) => {
  return ans === answer;
};

export const conditionalProbability: Exercise<Identifiers> = {
  id: "conditionalProbability",
  connector: "=",
  label: "Calcul de probabilité conditionnelle avec la formule de Bayes",
  levels: ["1reESM", "1reSpé", "1reTech", "TermTech", "1rePro", "TermPro"],
  isSingleStep: false,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getConditionalProbability, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  hasHintAndCorrection: true,
};
