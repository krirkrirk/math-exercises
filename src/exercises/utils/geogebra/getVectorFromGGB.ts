import { Vector } from "#root/math/geometry/vector";

export function getVectorFromGGB(command: string, name: string): Vector {
  const splitted = command.split(";");
  const x = +splitted[0].replace("(", "");
  const y = +splitted[1].replace(")", "");
  return new Vector(name, x.toTree(), y.toTree());
}
