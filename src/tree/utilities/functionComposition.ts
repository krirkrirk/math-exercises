import { Class } from '#root/types/class';
import { FunctionNode } from '../nodes/functions/functionNode';
import { Node } from '../nodes/node';

export const functionComposition = <T extends Class<FunctionNode>>(Compositor: T, arr: Node[]) => {
  let res: FunctionNode;

  if (arr.length < 1) throw Error(`received ${arr.length} nodes for operator composition`);
  res = new Compositor(arr[0]);
  for (let i = 1; i < arr.length; i++) {
    res = new Compositor(res, arr[i]);
  }

  return res;
};
