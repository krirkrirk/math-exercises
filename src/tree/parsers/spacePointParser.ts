import { SpacePoint } from "#root/math/geometry/spacePoint";
import e from "express";
import { valueParser } from "./valueParser";

export const spacePointParser = (ans: string) => {
  const formated = ans
    .replaceAll("\\left", "")
    .replaceAll("\\right", "")
    .replaceAll("(", "")
    .replaceAll(")", "");

  const coords = formated.split(";").map((e) => valueParser(e));
  if (coords?.some((e) => e === false)) return false;
  const trees = (coords as number[]).map((e) => e.toTree());
  return new SpacePoint("A", trees[0], trees[1], trees[2]);
};
