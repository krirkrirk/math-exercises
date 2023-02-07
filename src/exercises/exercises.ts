import { addAndSubExercise } from "./calcul/addAndSub";
import { fractionAndIntegerDivision } from "./calcul/fractions/fractionAndIntegerDivision";
import { fractionAndIntegerProduct } from "./calcul/fractions/fractionAndIntegerProduct";
import { fractionAndIntegerSum } from "./calcul/fractions/fractionAndIntegerSum";
import { fractionsDivision } from "./calcul/fractions/fractionsDivision";
import { fractionsProduct } from "./calcul/fractions/fractionsProduct";
import { fractionsSum } from "./calcul/fractions/fractionsSum";
import { simplifyFraction } from "./calcul/fractions/simplifyFraction";
import { operationsPriorities } from "./calcul/operationsPriorities";
import {
  allRoundings,
  roundToCentieme,
  roundToDixieme,
  roundToMillieme,
  roundToUnit,
} from "./calcul/rounding/rounding";
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
import { powersDivision, powersOfTenDivision } from "./powers/powersDivision";
import { powersOfTenToDecimal } from "./powers/powersOfTenToDecimal";
import { powersOfTenPower, powersPower } from "./powers/powersPower";
import { powersOfTenProduct, powersProduct } from "./powers/powersProduct";
import { scientificToDecimal } from "./powers/scientificToDecimal";
import { simplifySquareRoot } from "./squareRoots/simpifySquareRoot";

export const data = [{}];

export const exercises = [
  /**
   * calcul litteral
   */
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

  /**
   * square roots
   */
  simplifySquareRoot,

  /**
   * fractions
   */
  fractionAndIntegerDivision,
  fractionAndIntegerProduct,
  fractionAndIntegerSum,
  fractionsDivision,
  fractionsProduct,
  fractionsSum,
  simplifyFraction,

  /**
   * calcul
   */
  operationsPriorities,
  addAndSubExercise,

  /**
   * rounding
   */
  roundToCentieme,
  roundToDixieme,
  roundToMillieme,
  roundToUnit,
  allRoundings,
  /**
   * puissances
   */
  powersDivision,
  powersPower,
  powersProduct,
  powersOfTenDivision,
  powersOfTenPower,
  powersOfTenProduct,
  scientificToDecimal,
  powersOfTenToDecimal,
];
