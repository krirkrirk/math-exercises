import { MathExercise, Proposition, Question, shuffleProps, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { PowerNode } from '#root/tree/nodes/operators/powerNode';
import { v4 } from 'uuid';

export const powerDefinition: MathExercise = {
  id: 'powerDefinition',
  connector: '=',
  instruction: '',
  label: 'Écrire un produit sous forme de puissance',
  levels: ['4ème', '3ème', '2ndPro', 'CAP'],
  isSingleStep: true,
  sections: ['Puissances'],
  generator: (nb: number) => getDistinctQuestions(getPowerDefinitionQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

export function getPowerDefinitionQuestion(): Question {
  const int = randint(2, 11);
  const power = randint(2, 6);
  let statement = '';
  for (let i = 0; i < power; i++) {
    statement += int + '';
    if (i < power - 1) statement += '\\times';
  }
  const answer = new PowerNode(new NumberNode(int), new NumberNode(power)).toTex();
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(res, `${power}\\times${int}`);
    tryToAddWrongProp(res, `${int}\\times${power}`);
    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = new PowerNode(new NumberNode(int), new NumberNode(randint(2, 7))).toTex();
        proposition = {
          id: v4() + ``,
          statement: wrongAnswer,
          isRightAnswer: false,
          format: 'tex',
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffleProps(res, n);
  };

  const question: Question = {
    answer,
    instruction: `Écrire sous forme de puissance : $${statement}$`,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
