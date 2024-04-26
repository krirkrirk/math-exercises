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
} from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { SquareRoot } from '#root/math/numbers/reals/real';
import { TrinomConstructor } from '#root/math/polynomials/trinom';
import { randint } from "#root/math/utils/random/randint";
import { EqualNode } from '#root/tree/nodes/equations/equalNode';
import { SqrtNode } from '#root/tree/nodes/functions/sqrtNode';
import { AddNode } from '#root/tree/nodes/operators/addNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { SubstractNode } from '#root/tree/nodes/operators/substractNode';
import { VariableNode } from '#root/tree/nodes/variables/variableNode';


type Identifiers = {
  y: number,
  trinom: number[],
  image: number
};

function toPython(trinomcoeff: number[]): string {
  const aString = trinomcoeff[2] === 0 ? '' : (trinomcoeff[2] === 1 ? 'x**2' : `${trinomcoeff[2]}*x**2`);
  const bString = trinomcoeff[1] === 0 ? '' : (trinomcoeff[1] === 1 ? ' + x' : (trinomcoeff[1] > 0 ? ` + ${Math.abs(trinomcoeff[1])}*x` : ` - ${Math.abs(trinomcoeff[1])}*x`));
  const cString = trinomcoeff[0] === 0 ? '' : (trinomcoeff[0] === 1 ? ' + 1' : (trinomcoeff[0] > 0 ? ` + ${Math.abs(trinomcoeff[0])}` : ` - ${Math.abs(trinomcoeff[0])}`));
  return `${aString}${bString}${cString}`;
}

const getFunctionsTrinomialQuestion: QuestionGenerator<Identifiers> = () => {
  
  const trinom = TrinomConstructor.random();
  const y = randint(-5,5);
  const image = trinom.calculate(y);
  const trinomcoeff = trinom.coefficients
  const equation = toPython(trinomcoeff);

  const question: Question<Identifiers> = {
    answer: image.toString(),
    instruction: `Qu'affichera le programme suivant ?
\`\`\`
def f(x):
    y = ${equation}
    return y
y = f(${y})
print(y)
\`\`\`
`,
    keys: ["f","x","y","equal"],
    answerFormat: "tex",
    identifiers: {y, trinom: [trinom.a, trinom.b, trinom.c], image},
  };

  return question;
};
const getPropositions: QCMGenerator<Identifiers> = (n, { answer, trinom, image}) => {
  const propositions: Proposition[] = [];
  addValidProp(propositions, answer);

  const delta = trinom[1]**2 - 4*trinom[0]*trinom[2];
  const x1 = new SubstractNode(
    (-trinom[1]).toTree(),
    new SqrtNode(delta.toTree())
  ).simplify();
  const x2 = new AddNode(
    (-trinom[1]).toTree(),
    new SqrtNode(delta.toTree())
  ).simplify();

  const w1 = new FractionNode(x1, (2*trinom[0]).toTree()).simplify();
  const w2 = new FractionNode(x2, (2*trinom[0]).toTree()).simplify();
  const w3 = new EqualNode(
    new VariableNode('y'),
    image.toTree())
  
  tryToAddWrongProp(propositions, w1.toTex());
  tryToAddWrongProp(propositions, w2.toTex());
  tryToAddWrongProp(propositions, w3.toTex());

  while (propositions.length < n) {
    const random = randint(-10,10);
    const randomWrongAnswer = random.toString();
    tryToAddWrongProp(propositions, randomWrongAnswer)
  }
  return shuffleProps(propositions, n);
};

const isAnswerValid: VEA<Identifiers> = (ans, {answer})=>{
  return ans === answer
}
export const functionsTrinomial: Exercise<Identifiers> = {
  id: 'functionsTrinomial',
  label: "Évaluation de scripts python contenants des fonctions trinômiales",
  levels: ["2nde"],
  isSingleStep: true,
  sections: ["Python"],
  generator: (nb: number) => getDistinctQuestions(getFunctionsTrinomialQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
  getPropositions,
  isAnswerValid,
  subject: "Mathématiques"
};
