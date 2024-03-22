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
import { Rational } from "#root/math/numbers/rationals/rational";
import { randint } from "#root/math/utils/random/randint";
import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { random } from "#root/utils/random";

type Identifiers = {
  aCapB: number;
  aCapBBarre: number;
  aBarreCapB: number;
  aBarreCapBBarre: number;
  event: string;
  type: string;
  probaFrac: number[];
};

const getProbaFromTableNoContextQuestion: QuestionGenerator<
  Identifiers
> = () => {
  const aCapB = randint(1, 20);
  const aCapBBarre = randint(1, 20);
  const aBarreCapB = randint(1, 20);
  const aBarreCapBBarre = randint(1, 20);
  const total = aBarreCapB + aBarreCapBBarre + aCapB + aCapBBarre;
  const aTotal = aCapB + aCapBBarre;
  const bTotal = aCapB + aBarreCapB;
  const aBarreTotal = aBarreCapB + aBarreCapBBarre;
  const bBarreTotal = aBarreCapBBarre + aCapBBarre;
  let event = "";
  let proba: number[] = [];
  const type = random<
    "singleEvent" | "intersection" | "union" | "conditionnal"
  >(["singleEvent", "intersection", "union", "conditionnal"]);
  switch (type) {
    case "singleEvent":
      [event, proba] = random([
        ["P(A)", [aTotal, total]],
        ["P(B)", [bTotal, total]],
        ["P(\\overline A)", [aBarreTotal, total]],
        ["P(\\overline B)", [bBarreTotal, total]],
      ]);
      break;
    case "intersection":
      [event, proba] = random([
        ["P(A\\cap B)", [aCapB, total]],
        ["P(\\overline A\\cap B)", [aBarreCapB, total]],
        ["P(A\\cap \\overline B)", [aCapBBarre, total]],
        ["P(\\overline A \\cap \\overline B)", [aBarreCapBBarre, total]],
      ]);
      break;
    case "union":
      [event, proba] = random([
        ["P(A\\cup B)", [total - aBarreCapBBarre, total]],
        ["P(A\\cup \\overline B)", [total - aBarreCapB, total]],
        ["P(\\overline A \\cup B)", [total - aCapBBarre, total]],
        ["P(\\overline A \\cup \\overline B)", [total - aCapB, total]],
      ]);
      break;
    case "conditionnal":
      [event, proba] = random([
        ["P_A(B)", [aCapB, aTotal]],
        ["P_A(\\overline B)", [aCapBBarre, aTotal]],
        ["P_B(A)", [aCapB, bTotal]],
        ["P_B(\\overline{A})", [aBarreCapB, bTotal]],
        ["P_{\\overline A}(B)", [aBarreCapB, aBarreTotal]],
        ["P_{\\overline A}(\\overline B)", [aBarreCapBBarre, aBarreTotal]],
        ["P_{\\overline B}(A)", [aCapBBarre, bBarreTotal]],
        ["P_{\\overline B}(\\overline A)", [aBarreCapBBarre, bBarreTotal]],
      ]);
  }
  const answer = new Rational(proba[0], proba[1]).simplify().toTree().toTex();
  const question: Question<Identifiers> = {
    answer,
    instruction: `On considère deux événements $A$ et $B$. Le tableau suivant donne le nombre d'issues pour chacun des événements $A\\cap B$, $\\overline A\\cap B$, $A\\cap \\overline B$ et $\\overline A \\cap \\overline B$. Calculer la probabilité $${event}$.
    
| | $B$ | $\\overline{B}$|
|-|-|-|
|$A$|${aCapB}|${aCapBBarre}|
|$\\overline{A}$|${aBarreCapB}|${aBarreCapBBarre}|
    
    `,
    keys: [],
    answerFormat: "tex",
    identifiers: {
      aBarreCapB,
      aBarreCapBBarre,
      aCapB,
      aCapBBarre,
      event,
      type,
      probaFrac: proba,
    },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, aBarreCapB, aBarreCapBBarre, aCapB, aCapBBarre },
) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);
  while (propositions.length < n) {
    tryToAddWrongProp(
      propositions,
      new Rational(
        random([aBarreCapB, aBarreCapBBarre, aCapB, aCapBBarre]),
        random([aBarreCapB, aBarreCapBBarre, aCapB, aCapBBarre]) +
          random([aBarreCapB, aBarreCapBBarre, aCapB, aCapBBarre]),
      )
        .simplify()
        .toTree()
        .toTex(),
    );
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, { answer, probaFrac }) => {
  const fracTexs = new FractionNode(
    probaFrac[0].toTree(),
    probaFrac[1].toTree(),
  )
    .simplify()
    .toAllValidTexs();
  return fracTexs.includes(ans);
};
export const probaFromTableNoContext: Exercise<Identifiers> = {
  id: "probaFromTableNoContext",
  connector: "=",
  label:
    "Utiliser un tableau à double entrée pour calculer une probabilité (sans contexte)",
  levels: ["1rePro", "1reSpé", "1reTech", "1reESM", "2ndPro"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getProbaFromTableNoContextQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
