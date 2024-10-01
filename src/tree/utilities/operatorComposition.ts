import { Class } from "#root/types/class";
import { Node } from "../nodes/node";
import {
  CommutativeOperatorNode,
  OperatorNode,
} from "../nodes/operators/operatorNode";

export const operatorComposition = <T extends Class<CommutativeOperatorNode>>(
  Compositor: T,
  arr: Node[],
) => {
  let res: InstanceType<T>;

  if (!arr.length) throw Error(`received no nodes for operator composition`);
  if (arr.length == 1) return arr[0] as unknown as InstanceType<T>;
  res = new Compositor(arr[0], arr[1]) as unknown as InstanceType<T>;
  for (let i = 2; i < arr.length; i++) {
    res = new Compositor(res, arr[i]) as unknown as InstanceType<T>;
  }

  return res;
};
