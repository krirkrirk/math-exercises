import { GeogebraParser } from "./geogebraParser";

const suits = [
  {
    commands: ["u=Vector[(2,1),(1,3)]"],
    expect: [-1, 2],
  },
  {
    commands: ["A=(1,3)", "B=(2,1)", "u=Vector[A,B]"],
    expect: [1, -2],
  },
  {
    commands: ["A=(1,3)", "u=Vector[A,(3,4)]"],
    expect: [2, 1],
  },
];
test("geogebraParser", () => {
  try {
    for (const suit of suits) {
      const parser = new GeogebraParser(suit.commands);
      const vectors = parser.vectors();
      console.log(vectors);
      vectors.forEach((vector) => {
        const [x, y] = vector;
        expect(x).toEqual(suit.expect[0]);
        expect(y).toEqual(suit.expect[1]);
      });
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});
