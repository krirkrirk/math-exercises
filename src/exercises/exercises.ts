import { allIdentities } from "./calculLitteral/distributivity/allIdentities";
import { doubleDistributivity } from "./calculLitteral/distributivity/doubleDistributivity";
import { firstIdentity } from "./calculLitteral/distributivity/firstIdentity";
import { secondIdentity } from "./calculLitteral/distributivity/secondIdentity";
import { simpleDistributivity } from "./calculLitteral/distributivity/simpleDistributivity";
import { thirdIdentity } from "./calculLitteral/distributivity/thirdIdentity";
import { equationType1Exercise } from "./calculLitteral/equation/equationType1Exercise";
import { equationType2Exercise } from "./calculLitteral/equation/equationType2Exercise";
import { equationType3Exercise } from "./calculLitteral/equation/equationType3Exercise";
import { equationType4Exercise } from "./calculLitteral/equation/equationType4Exercise";
import { factoType1Exercise } from "./calculLitteral/factorisation/factoType1Exercise";
import { simplifySquareRoot } from "./squareRoots/simpifySquareRoot";

export const exercises = [
  factoType1Exercise,
  simpleDistributivity,
  doubleDistributivity,
  firstIdentity,
  secondIdentity,
  thirdIdentity,
  allIdentities,
  equationType1Exercise,
  equationType2Exercise,
  equationType3Exercise,
  equationType4Exercise,
  simplifySquareRoot,
];
