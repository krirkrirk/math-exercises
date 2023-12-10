import { shuffleProps, MathExercise, Proposition, Question, tryToAddWrongProp } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { random } from '#root/utils/random';
import { v4 } from 'uuid';

const words = [
  'angle',
  'armoire',
  'banc',
  'bureau',
  'cabinet',
  'carreau',
  'chaise',
  'classe',
  'clé',
  'coin',
  'couloir',
  'dossier',
  'eau',
  'école',
  'écriture',
  'entrée',
  'escalier',
  'étagère',
  'étude',
  'extérieur',
  'fenêtre',
  'intérieur',
  'lavabo',
  'lecture',
  'lit',
  'marche',
  'matelas',
  'maternelle',
  'meuble',
  'mousse',
  'mur',
  'peluche',
  'placard',
  'plafond',
  'porte',
  'portemanteau',
  'poubelle',
  'radiateur',
  'rampe',
  'récréation',
  'rentrée',
  'rideau',
  'robinet',
  'salle',
  'savon',
  'serrure',
  'serviette',
  'siège',
  'sieste',
  'silence',
  'sol',
  'sommeil',
  'sonnette',
  'sortie',
  'table',
  'tableau',
  'tabouret',
  'tapis',
  'tiroir',
  'toilette',
  'vitre',
];
export const anagrams: MathExercise<QCMProps, VEAProps> = {
  id: 'anagrams',
  connector: '=',
  instruction: '',
  label: "Compter le nombre d'anagrammes d'un mot",
  levels: ['TermSpé'],
  isSingleStep: true,
  sections: ['Combinatoire et dénombrement'],
  generator: (nb: number) => getDistinctQuestions(getAnagramsQuestion, nb),
  qcmTimer: 60,
  freeTimer: 60,
};

const letters = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  'é',
  'è',
  'à',
  'ç',
];
export function getAnagramsQuestion(): Question {
  const word = random(words);
  const repeats: number[] = [];
  const wordLetters = word.split('');
  letters.forEach((letter) => {
    const nbOfRepeats = wordLetters.filter((l) => l === letter).length;
    if (nbOfRepeats > 1) repeats.push(nbOfRepeats);
  });

  const getFacto = (n: number): number => {
    if (n === 1) return 1;
    return n * getFacto(n - 1);
  };

  const facto = word
    .split('')
    .map((el, index) => index + 1)
    .reduce((acc, curr) => acc * curr, 1);
  let arrangements = 1;
  repeats.forEach((nbOfRepeats) => {
    arrangements *= getFacto(nbOfRepeats);
  });
  const answer = facto / arrangements;
  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4(),
      statement: answer + ``,
      isRightAnswer: true,
      format: 'tex',
    });

    tryToAddWrongProp(res, Math.pow(word.length, word.length) + '');
    tryToAddWrongProp(res, (word.length * (word.length + 1)) / 2 + '');
    tryToAddWrongProp(res, word.length * word.length + '');

    const missing = n - res.length;
    for (let i = 0; i < missing; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        const wrongAnswer = randint(1000, 10000);
        proposition = {
          id: v4() + ``,
          statement: wrongAnswer + '',
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
    answer: answer + '',
    instruction: `Combien d'anagrammes mathématiques du mot ${word} sont possibles ? `,
    keys: [],
    getPropositions,
    answerFormat: 'tex',
  };

  return question;
}
