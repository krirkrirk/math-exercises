import { valueParser } from "./valueParser";
import { SpaceVector } from "#root/math/geometry/spaceVector";

export const spaceVectorParser = (ans: string) => {
  const formated = ans
    .replaceAll("\\left", "")
    .replaceAll("\\right", "")
    .replaceAll("(", "")
    .replaceAll(")", "");

  const coords = formated.split(";").map((e) => valueParser(e));
  if (coords?.some((e) => e === false)) return false;
  const trees = (coords as number[]).map((e) => e.toTree());
  return new SpaceVector("A", trees[0], trees[1], trees[2]);
};
