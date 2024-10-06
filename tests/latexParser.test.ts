import { parseLatex } from "../src/tree/parsers/latexParser";

const texsThatShouldNotChange = [
  "3",
  "3,14",
  "-4",
  "-1,003",
  "x",
  "-x",
  "3+4",
  "3-9",
  "1,13-33",
  "-1,3432-0,001",
  "3+x",
  "3-x",
  "x+3",
  "x-3",
  "2x+1",
  "1+2x",
  "3x^2+2x+1",
  "x^2+x+1",
  "-x^2-x-1",
];

const texsThatShouldChange: {
  in: string;
  out: string;
}[] = [
  { in: "3\\times x+1", out: "3x+1" },
  {
    in: "3\\times x^2 - 2\\times x +1",
    out: "3x^2-2x+1",
  },
  {
    in: "-3\\times x^2 + (-2)\\times x -1",
    out: "-3x^2-2x-1",
  },
  {
    in: "(-3)\\times x^2 + (-2)\\times x +(-1)",
    out: "-3x^2-2x-1",
  },
];

test("latexParser", () => {
  try {
    for (const tex of texsThatShouldNotChange) {
      expect(parseLatex(tex).toTex()).toBe(tex);
    }
    for (const data of texsThatShouldChange) {
      expect(parseLatex(data.in).toTex()).toBe(data.out);
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});
