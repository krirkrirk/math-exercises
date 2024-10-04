import { isLetter } from "#root/utils/strings/isLetter";

//to use when the answer is a segment type [AB]
export const isSegmentName = (ans: string) => {
  if (
    ans.length === 4 &&
    ans[0] === "[" &&
    ans[ans.length - 1] === "]" &&
    isLetter(ans[1]) &&
    isLetter(ans[2])
  )
    return true;
  return false;
};
