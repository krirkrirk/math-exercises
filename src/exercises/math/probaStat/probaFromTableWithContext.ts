import {
  Exercise,
  GetInstruction,
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
import { random } from "#root/utils/alea/random";
import { dollarize } from "#root/utils/latex/dollarize";
import { mdTable } from "#root/utils/markdown/mdTable";

type Identifiers = {
  aCapB: number;
  aCapBBarre: number;
  aBarreCapB: number;
  aBarreCapBBarre: number;
  event: string;
  type: string;
  probaFrac: number[];
};

const getInstruction: GetInstruction<Identifiers> = ({
  aBarreCapB,
  aBarreCapBBarre,
  aCapB,
  aCapBBarre,
  event,
  probaFrac,
  type,
}) => {
  return `Le tableau suivant donne le nombre de filles et de garçons portant des lunettes dans un lycée : 

${mdTable([
  [" ", "Porte des lunettes", "Ne porte pas de lunettes"],
  ["Filles", dollarize(aCapB), dollarize(aCapBBarre)],
  ["Garçons", dollarize(aBarreCapB), dollarize(aBarreCapBBarre)],
])}

On choisit un élève au hasard. Quelle est la probabilité de tomber sur ${event} ?
    `;
};
const getProbaFromTableWithContextQuestion: QuestionGenerator<
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
  const type = random<"singleEvent" | "intersection" | "union">([
    "singleEvent",
    "intersection",
    "union",
  ]);
  switch (type) {
    case "singleEvent":
      [event, proba] = random([
        ["une fille", [aTotal, total]],
        ["une élève qui porte des lunettes", [bTotal, total]],
        ["un garçon", [aBarreTotal, total]],
        ["une élève qui ne porte pas de lunettes", [bBarreTotal, total]],
      ]);
      break;
    case "intersection":
      [event, proba] = random([
        ["une fille qui porte des lunettes", [aCapB, total]],
        ["un garçon qui porte des lunettes", [aBarreCapB, total]],
        ["une fille qui ne porte pas de lunettes", [aCapBBarre, total]],
        ["un garçon qui ne porte pas de lunettes", [aBarreCapBBarre, total]],
      ]);
      break;
    case "union":
      [event, proba] = random([
        [
          "une fille ou un élève qui porte des lunettes",
          [total - aBarreCapBBarre, total],
        ],
        [
          "une fille ou un élève qui ne porte pas de lunettes",
          [total - aBarreCapB, total],
        ],
        [
          "un garçon ou un élève qui porte des lunettes",
          [total - aCapBBarre, total],
        ],
        [
          "un garçon ou un élève qui ne porte pas de lunettes",
          [total - aCapB, total],
        ],
      ]);
      break;
  }
  const answer = new Rational(proba[0], proba[1]).simplify().toTree().toTex();

  const identifiers = {
    aBarreCapB,
    aBarreCapBBarre,
    aCapB,
    aCapBBarre,
    event,
    type,
    probaFrac: proba,
  };
  const question: Question<Identifiers> = {
    answer,
    instruction: getInstruction(identifiers),
    keys: [],
    answerFormat: "tex",
    identifiers,
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
export const probaFromTableWithContext: Exercise<Identifiers> = {
  id: "probaFromTableWithContext",
  connector: "=",
  label:
    "Utiliser un tableau à double entrée pour calculer une probabilité (avec contexte)",
  levels: ["1rePro", "1reSpé", "1reTech", "1reESM", "2ndPro"],
  isSingleStep: true,
  sections: ["Probabilités"],
  generator: (nb: number) =>
    getDistinctQuestions(getProbaFromTableWithContextQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
  getInstruction,
};
