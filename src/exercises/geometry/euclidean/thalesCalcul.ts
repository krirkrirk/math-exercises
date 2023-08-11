import { Exercise, Proposition, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { randint } from '#root/math/utils/random/randint';
import { Node } from '#root/tree/nodes/node';
import { NumberNode } from '#root/tree/nodes/numbers/numberNode';
import { FractionNode } from '#root/tree/nodes/operators/fractionNode';
import { simplifyNode } from '#root/tree/parsers/simplify';
import { coinFlip } from '#root/utils/coinFlip';
import { shuffle } from '#root/utils/shuffle';
import { v4 } from 'uuid';

export const thalesCalcul: Exercise = {
  id: 'thalesCalcul',
  connector: '=',
  instruction: '',
  label: 'Utiliser le théoreme de Thalès pour faire des calculs',
  levels: ['5', '4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getThales, nb),
};

export function getThales(): Question {
  const vertices = [];
  const code = 65 + randint(0, 22); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 5; i++) vertices.push(String.fromCharCode(code + i));

  const [xA, yA] = [randint(-10, 11), randint(-10, 11)];
  let xB, yB, xC, yC;
  let d1, d2, d3; // distance entre le point A et B
  let theta = 0; // angle entre AB et AC

  do {
    [xB, yB, xC, yC] = [randint(-10, 11), randint(-10, 11), randint(-10, 11), randint(-10, 11)];
    d1 = Math.hypot(xB - xA, yB - yA); // Calculer la distance entre A et B
    d2 = Math.hypot(xC - xA, yC - yA); // Calculer la distance entre A et C
    theta = Math.acos(((xB - xA) * (xC - xA) + (yB - yA) * (yC - yA)) / (d1 * d2));
  } while (!theta || theta < 0.35 || theta > 2.1 || d1 / d2 > 1.3 || d1 / d2 < 0.7);

  d3 = Math.sqrt(d1 ** 2 + d2 ** 2 - 2 * d1 * d2 * Math.cos(theta)); // Calculer la distance entre C et B
  // CB² = AB² * AC² - 2*AB*AC*cos(theta)  : pythagore généralisé

  const factor = randint(-5, 6, [-2, -1, 0, 1, 2]) / 10; // facteur = AB/AE, Pour que l'affichage soit acceptable, les valeurs de factor sont +- 0.5 0.4 0.3

  const [xD, yD] = [xA + factor * (xB - xA), yA + factor * (yB - yA)];
  const [xE, yE] = [xA + factor * (xC - xA), yA + factor * (yC - yA)];

  const xMin = Math.min(xA, xB, xC, xD, xE);
  const xMax = Math.max(xA, xB, xC, xD, xE);
  const yMin = Math.min(yA, yB, yC, yD, yE);
  const yMax = Math.max(yA, yB, yC, yD, yE);

  // AB AC BC AD AE
  const sides = [
    `${vertices[0]}${vertices[1]}`,
    `${vertices[0]}${vertices[3]}`,
    `${vertices[0]}${vertices[2]}`,
    `${vertices[0]}${vertices[4]}`,
    `${vertices[1]}${vertices[2]}`,
    `${vertices[3]}${vertices[4]}`,
  ];

  // round pour avoir des valeurs dans N tout en gardant les proportions pour que ça soit cohérent. sides[i] a pour longueur sideLengths[i]
  const sideLengths = [d1, factor * d1, d2, factor * d2, d3, factor * d3].map((el) => Math.round(Math.abs(el)));

  const rand = randint(0, 3);
  let rand2 = randint(0, 3, [rand]);
  if (sideLengths[2 * rand] === sideLengths[2 * rand2]) rand2 = randint(0, 3, [rand, rand2]); // condition pour pas prendre 2 longueurs identiques

  let instruction = `Dans la figure ci-dessous, nous avons (${vertices[3]}${vertices[4]})//(${vertices[1]}${vertices[2]}), `;
  let statement: Node;
  let startStatement;

  if (coinFlip()) {
    // a/b = c/d on cherche c
    instruction += `${sides[2 * rand]} = $${sideLengths[2 * rand]}$, ${sides[2 * rand + 1]} = $${
      sideLengths[2 * rand + 1]
    }$, ${sides[2 * rand2]} = $${sideLengths[2 * rand2]}$.$\\\\$Déterminer ${sides[2 * rand2 + 1]}`;

    startStatement = `${sides[2 * rand2 + 1]}`;

    statement = simplifyNode(
      new FractionNode(
        new NumberNode(sideLengths[2 * rand2] * sideLengths[2 * rand + 1]),
        new NumberNode(sideLengths[2 * rand]),
      ),
    );
  } else {
    // a/b = c/d on cherche d
    instruction += `${sides[2 * rand]} = $${sideLengths[2 * rand]}$, ${sides[2 * rand + 1]} = $${
      sideLengths[2 * rand + 1]
    }$, ${sides[2 * rand2 + 1]} = $${sideLengths[2 * rand2 + 1]}$.$\\\\$Déterminer ${sides[2 * rand2]}`;

    startStatement = `${sides[2 * rand2]}`;

    statement = simplifyNode(
      new FractionNode(
        new NumberNode(sideLengths[2 * rand2 + 1] * sideLengths[2 * rand]),
        new NumberNode(sideLengths[2 * rand + 1]),
      ),
    );
  }

  const commands = [
    `${vertices[0]} = Point({${xA}, ${yA}})`,
    `${vertices[1]} = Point({${xB}, ${yB}})`,
    `${vertices[2]} = Point({${xC}, ${yC}})`,
    `${vertices[3]} = Point(${vertices[0]}, Vector(${factor}Vector(${vertices[0]},${vertices[1]})))`,
    `${vertices[4]} = Intersect(Line(${vertices[3]}, Line(${vertices[1]}, ${vertices[2]})) , Line(${vertices[0]}, ${vertices[2]}))`,
    `l = Segment(${vertices[0]}, ${vertices[1]})`,
    `i = Segment(${vertices[0]}, ${vertices[2]})`,
    `j = Segment(${vertices[1]}, ${vertices[2]})`,
    `k = Segment(${vertices[3]}, ${vertices[4]})`,
    `If(${factor} < 0, Segment(${vertices[0]}, ${vertices[3]}))`,
    `If(${factor} < 0, Segment(${vertices[0]}, ${vertices[4]}))`,
    `ShowAxes(false)`,
    `ShowGrid(false)`,
    `ShowLabel(${vertices[0]}, true)`,
    `ShowLabel(${vertices[1]}, true)`,
    `ShowLabel(${vertices[2]}, true)`,
    `ShowLabel(${vertices[3]}, true)`,
    `ShowLabel(${vertices[4]}, true)`,
  ];

  const getPropositions = (n: number) => {
    const res: Proposition[] = [];

    res.push({
      id: v4() + '',
      statement: statement.toTex(),
      isRightAnswer: true,
    });

    for (let i = 0; i < n - 1; i++) {
      let isDuplicate: boolean;
      let proposition: Proposition;

      do {
        proposition = {
          id: v4() + '',
          statement: simplifyNode(
            new FractionNode(new NumberNode(randint(2, 30)), new NumberNode(randint(2, 30))),
          ).toTex(),
          isRightAnswer: false,
        };

        isDuplicate = res.some((p) => p.statement === proposition.statement);
      } while (isDuplicate);

      res.push(proposition);
    }

    return shuffle(res);
  };

  const question: Question = {
    instruction,
    startStatement,
    answer: statement.toTex(),
    keys: [],
    commands,
    coords: [xMin - 1, xMax + 1, yMin - 1, yMax + 1],
    getPropositions,
  };

  return question;
}
