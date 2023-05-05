import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { round } from '#root/math/utils/round';

export const TriangleArea: Exercise = {
  id: 'TriangleArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un triangle",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTriangleArea, nb),
};

export function getTriangleArea(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomTriangle(0.69, 1.5, ...vertices);

  const sides = [triangle.getSideAName(), triangle.getSideBName(), triangle.getSideCName()];
  const sidesLength = [
    round(triangle.getSideAnumber(), 2),
    round(triangle.getSideBnumber(), 2),
    round(triangle.getSideCnumber(), 2),
  ];
  const angles = [triangle.getAngleA(), triangle.getAngleB(), triangle.getAngleC()];

  const randSide1 = randint(0, 3);
  const randSide2 = randint(0, 3, [randSide1]);
  const randAngle = randint(0, 3, [randSide1, randSide2]);

  const height = round(sidesLength[randSide2] * Math.sin(angles[randAngle]), 2);

  const commands = [
    ...triangle.generateCommands({
      sideLabels: [sides[randSide1]],
      SetCaption: [sidesLength[randSide1] + ''],
    }),
    `poi = Intersect(PerpendicularLine(${vertices[randSide1]},${sides[randSide1]}),${sides[randSide1]})`,
    `ff = Segment(${vertices[randSide1]}, poi)`,
    `ShowLabel(ff, true)`,
    `SetCaption(ff, "${height}")`,
    `SetLineStyle(ff, 1)`,
    `alpha = Angle(${vertices[randSide1]},poi ,${vertices[randSide2]}, Line(${vertices[randSide1]},poi))`,
    `ShowLabel(alpha, false)`,
  ];

  const question: Question = {
    instruction: `Calculer l'aire du triangle ${triangle.getTriangleName()} sachant que ${sides[randSide1]} = $${
      sidesLength[randSide1]
    }$ cm.`,
    answer: round(triangle.getArea(), 2) + '',
    keys: [...vertices, 'equal'],
    commands,
    coords: triangle.generateCoords(),
  };

  return question;
}
