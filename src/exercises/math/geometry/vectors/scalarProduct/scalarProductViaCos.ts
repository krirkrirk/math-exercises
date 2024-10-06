import {
  Exercise,
  Proposition,
  QCMGenerator,
  Question,
  QuestionGenerator,
  VEA,
  addValidProp,
  tryToAddWrongProp,
} from "#root/exercises/exercise";
import { getDistinctQuestions } from "#root/exercises/utils/getDistinctQuestions";
import { RemarkableValueConstructor } from "#root/math/trigonometry/remarkableValue";
import { remarkableTrigoValues } from "#root/math/trigonometry/remarkableValues";
import { randint } from "#root/math/utils/random/randint";
import { NumberNode } from "#root/tree/nodes/numbers/numberNode";
import { MultiplyNode } from "#root/tree/nodes/operators/multiplyNode";
import { randomLetter } from "#root/utils/strings/randomLetter";
import { shuffle } from "#root/utils/shuffle";

type Identifiers = {
  AB: number;
  AC: number;
  trigoPoint: string;
};

//|u| |v| cos(u,v)
const getScalarProductViaCosQuestion: QuestionGenerator<Identifiers> = () => {
  const AB = randint(1, 10);
  const AC = randint(1, 10);
  const trigo = RemarkableValueConstructor.mainInterval();
  const answer = new MultiplyNode(new NumberNode(AB * AC), trigo.cos)
    .simplify()
    .toTex();

  const letters: string[] = [];
  for (let i = 0; i < 3; i++) {
    letters.push(randomLetter(true, letters));
  }
  letters.sort((a, b) => a.localeCompare(b));
  const [letterA, letterB, letterC] = letters;
  const question: Question<Identifiers> = {
    answer,
    instruction: `Soient trois points $${letterA}$, $${letterB}$ et $${letterC}$ tels que $${letterA}${letterB} = ${AB}$, $${letterA}${letterC}= ${AC}$, et $\\widehat{${letterB}${letterA}${letterC}} = ${trigo.angle.toTex()}$. Calculer $\\overrightarrow{${letterA}${letterB}}\\cdot \\overrightarrow{${letterA}${letterC}}$.`,
    keys: ["pi"],
    answerFormat: "tex",
    identifiers: { AB, AC, trigoPoint: trigo.point },
  };

  return question;
};

const getPropositions: QCMGenerator<Identifiers> = (
  n,
  { answer, AB, AC, trigoPoint },
) => {
  const propositions: Proposition[] = [];
  const trigo = remarkableTrigoValues.find((v) => v.point === trigoPoint)!;

  addValidProp(propositions, answer);
  tryToAddWrongProp(
    propositions,
    new MultiplyNode(new NumberNode(AB * AC), trigo.sin).simplify().toTex(),
  );
  const coeff = new NumberNode(AB * AC);
  while (propositions.length < n) {
    const trigoValue = RemarkableValueConstructor.mainInterval();
    tryToAddWrongProp(
      propositions,
      new MultiplyNode(coeff, trigoValue.sin).simplify().toTex(),
    );
  }
  return shuffle(propositions);
};

const isAnswerValid: VEA<Identifiers> = (ans, { AB, AC, trigoPoint }) => {
  const trigo = remarkableTrigoValues.find((v) => v.point === trigoPoint)!;
  const tree = new MultiplyNode(new NumberNode(AB * AC), trigo.cos).simplify();
  const texs = tree.toAllValidTexs();
  return texs.includes(ans);
};
export const scalarProductViaCos: Exercise<Identifiers> = {
  id: "scalarProductViaCos",
  connector: "=",
  label: "Calculer un produit scalaire (formule avec $cos$)",
  levels: ["1reSpé"],
  isSingleStep: true,
  sections: ["Vecteurs", "Produit scalaire"],
  generator: (nb: number) =>
    getDistinctQuestions(getScalarProductViaCosQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques",
};
