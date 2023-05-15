import { Exercise, Question } from '#root/exercises/exercise';
import { getDistinctQuestions } from '#root/exercises/utils/getDistinctQuestions';
import { TriangleConstructor } from '#root/math/geometry/triangles';
import { randint } from '#root/math/utils/random/randint';
import { shuffle } from '#root/utils/shuffle';

export const triangleArea: Exercise = {
  id: 'triangleArea',
  connector: '=',
  instruction: '',
  label: "Calculer l'aire d'un triangle (avec figure)",
  levels: ['4', '3', '2'],
  isSingleStep: false,
  section: 'Géométrie euclidienne',
  generator: (nb: number) => getDistinctQuestions(getTriangleArea, nb),
};

export function getTriangleArea(): Question {
  const vertices = [];
  const code = 65 + randint(0, 24); // Générer un code de caractère majuscule aléatoire (A-Z)
  for (let i = 0; i < 3; i++) vertices.push(String.fromCharCode(code + i));

  const triangle = TriangleConstructor.createRandomTriangle({ minAngle: 0.69, maxAngle: 1.5, names: vertices });

  const sides = [triangle.getSideAName(), triangle.getSideBName(), triangle.getSideCName()];
  const sidesLength = [triangle.getSideAnumber(), triangle.getSideBnumber(), triangle.getSideCnumber()].map((el) =>
    Math.round(el / 2),
  );
  const angles = [triangle.getAngleA(), triangle.getAngleB(), triangle.getAngleC()];

  const randoms = shuffle([0, 1, 2]);

  const height = Math.round(sidesLength[randoms[1]] * Math.sin(angles[randoms[2]]));

  const commands = [
    ...triangle.generateCommands({
      showLabels: [sides[randoms[0]]],
      setCaptions: [sidesLength[randoms[0]] + ''],
    }),
    `poi = Intersect(PerpendicularLine(${vertices[randoms[0]]},${sides[randoms[0]]}),${sides[randoms[0]]})`,
    `ShowLabel(poi, true)`,
    `SetCaption(poi, "${String.fromCharCode(code + 3)}")`,
    `seg = Segment(${vertices[randoms[0]]}, poi)`,
    `ShowLabel(seg, true)`,
    `SetCaption(seg, "${height}")`,
    `SetLineStyle(seg, 1)`,
    `alpha = Angle(${vertices[randoms[0]]},poi ,${vertices[randoms[1]]}, Line(${vertices[randoms[0]]},poi))`,
    `ShowLabel(alpha, false)`,
  ];

  const question: Question = {
    instruction: `Calculer l'aire du triangle ${triangle.getTriangleName()} sachant que ${sides[randoms[0]]} = $${
      sidesLength[randoms[0]]
    }$ cm et la hauteur ${vertices[randoms[0]]}${String.fromCharCode(code + 3)} = $${height}$ cm.`,
    answer: (sidesLength[randoms[0]] * height) / 2 + '',
    keys: [...vertices, 'equal', 'cm2'],
    commands,
    coords: triangle.generateCoords(),
  };

  return question;
}
