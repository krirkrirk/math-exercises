import { addAndSubExercise } from './calcul/addAndSub';
import { addAndSubWithoutRelatives } from './calcul/addAndSubWithoutRelatives';
import { fractionAndIntegerDivision } from './calcul/fractions/fractionAndIntegerDivision';
import { fractionAndIntegerProduct } from './calcul/fractions/fractionAndIntegerProduct';
import { fractionAndIntegerSum } from './calcul/fractions/fractionAndIntegerSum';
import { fractionToPercentToDecimal } from './calcul/fractions/fractionToPercentToDecimal';
import { fractionsDivision } from './calcul/fractions/fractionsDivision';
import { fractionsProduct } from './calcul/fractions/fractionsProduct';
import { fractionsSum } from './calcul/fractions/fractionsSum';
import { simplifyFraction } from './calcul/fractions/simplifyFraction';
import { mentalAddAndSub } from './calcul/mentalCaluls.ts/mentalAddAndSub';
import { mentalDivisions } from './calcul/mentalCaluls.ts/mentalDivisions';
import { mentalMultiplications } from './calcul/mentalCaluls.ts/mentalMultiplications';
import { mentalPercentage } from './calcul/mentalCaluls.ts/mentalPercentage';
import { operationsPriorities } from './calcul/operations/operationsPriorities';
import { operationsPrioritiesWithoutRelative } from './calcul/operations/operationsPrioritiesWithoutRelative';
import { primeNumbers } from './calcul/arithmetics/primeNumbers';
import {
  allRoundings,
  roundToCentieme,
  roundToDixieme,
  roundToMillieme,
  roundToUnit,
} from './calcul/rounding/rounding';
import { allIdentities } from './calculLitteral/distributivity/allIdentities';
import { doubleDistributivity } from './calculLitteral/distributivity/doubleDistributivity';
import { firstIdentity } from './calculLitteral/distributivity/firstIdentity';
import { secondIdentity } from './calculLitteral/distributivity/secondIdentity';
import { simpleDistributivity } from './calculLitteral/distributivity/simpleDistributivity';
import { thirdIdentity } from './calculLitteral/distributivity/thirdIdentity';
import { equationSimpleSquare } from './calculLitteral/equation/equationSimpleSquare';
import { equationType1Exercise } from './calculLitteral/equation/equationType1Exercise';
import { equationType2Exercise } from './calculLitteral/equation/equationType2Exercise';
import { equationType3Exercise } from './calculLitteral/equation/equationType3Exercise';
import { equationType4Exercise } from './calculLitteral/equation/equationType4Exercise';
import { firstDegreeEquation } from './calculLitteral/equation/firstDegreeEquation';
import { fractionEquation } from './calculLitteral/equation/fractionEquation';
import { multiplicationEquation } from './calculLitteral/equation/multiplicationEquation';
import { factoIdRmq1 } from './calculLitteral/factorisation/factoIdRmq1';
import { factoIdRmq2 } from './calculLitteral/factorisation/factoIdRmq2';
import { factoIdRmq3 } from './calculLitteral/factorisation/factoIdRmq3';
import { factoType1Exercise } from './calculLitteral/factorisation/factoType1Exercise';
import { aeraConversion } from './conversion/aeraConversion';
import { capacityConversion } from './conversion/capacityConversion';
import { lengthConversion } from './conversion/lengthConversion';
import { massConversion } from './conversion/massConversion';
import { volumeCapacityConversion } from './conversion/volumeCapacityConversion';
import { volumeConversion } from './conversion/volumeConversion';
import { constanteDerivative } from './derivation/derivative/constanteDerivative';
import { firstDegreeDerivative } from './derivation/derivative/firstDegreeDerivative';
import { inverseFunctionDerivative } from './derivation/derivative/inverseFunctionDerivative';
import { powerFunctionDerivative } from './derivation/derivative/powerFunctionDerivative';
import { rootFunctionDerivative } from './derivation/derivative/rootFunctionDerivative';
import { secondDegreeDerivative } from './derivation/derivative/secondDegreeDerivative';
import { thirdDegreeDerivative } from './derivation/derivative/thirdDegreeDerivative';
import { usualDerivative } from './derivation/derivative/usualderivative';
import { derivativeNumberReading } from './derivation/derivativeNumberReading';
import { leadingCoefficient } from './functions/affines/leadingCoefficient';
import { midpoint } from './geometry/cartesian/midpoint';
import { pythagore } from './geometry/euclidean/pythagore';
import { pythagoreCalcul } from './geometry/euclidean/pythagoreCalcul';
import { rightTriangleArea } from './geometry/euclidean/rightTriangleArea';
import { thales } from './geometry/euclidean/thales';
import { thalesCalcul } from './geometry/euclidean/thalesCalcul';
import { trigonometry } from './geometry/euclidean/trigonometry';
import { trigonometryAngleCalcul } from './geometry/euclidean/trigonometryAngleCalcul';
import { trigonometrySideCalcul } from './geometry/euclidean/trigonometrySideCalcul';
import { scalarProductViaCoords } from './geometry/vectors/scalarProductViaCoords';
import { applyPercent } from './percent/applyPercent';
import { averageEvolutionRate } from './percent/averageEvolutionRate';
import { globalPercent } from './percent/globalPercent';
import { reciprocalPercentage } from './percent/reciprocalPercentage';
import { powersDivision, powersOfTenDivision } from './powers/powersDivision';
import { powersOfTenToDecimal } from './powers/powersOfTenToDecimal';
import { powersOfTenPower, powersPower } from './powers/powersPower';
import { powersOfTenProduct, powersProduct } from './powers/powersProduct';
import { scientificToDecimal } from './powers/scientificToDecimal';

import { conditionalProbability } from './probaStat/conditionalProbability';
import { marginalAndConditionalFrequency } from './probaStat/marginalAndConditionalFrequency';
import { probabilityTree } from './probaStat/probabilityTree';

import { arithmeticExplicitFormulaUsage } from './sequences/arithmetic/arithmeticExplicitFormulaUsage';
import { arithmeticFindExplicitFormula } from './sequences/arithmetic/arithmeticFindExplicitFormula';
import { arithmeticFindReason } from './sequences/arithmetic/arithmeticFindReason';
import { arithmeticReasonUsage } from './sequences/arithmetic/arithmeticReasonUsage';
import { arithmeticRecurrenceFormulaUsage } from './sequences/arithmetic/arithmeticRecurrenceFormulaUsage';
import { arithmeticThresholdFind } from './sequences/arithmetic/arithmeticThresholdFind';

import { geometricExplicitFormulaUsage } from './sequences/geometric/geometricExplicitFormulaUsage';
import { geometricFindExplicitFormula } from './sequences/geometric/geometricFindExplicitFormula';
import { geometricFindReason } from './sequences/geometric/geometricFindReason';
import { geometricReasonUsage } from './sequences/geometric/geometricReasonUsage';
import { geometricRecurrenceFormulaUsage } from './sequences/geometric/geometricRecurrenceFormulaUsage';
import { simplifySquareRoot } from './squareRoots/simpifySquareRoot';
import { rectangleArea } from './geometry/euclidean/rectangleArea';
import { rectanglePerimeter } from './geometry/euclidean/rectanglePerimeter';
import { squareArea } from './geometry/euclidean/squareArea';
import { squarePerimeter } from './geometry/euclidean/squarePerimeter';
import { trianglePerimeter } from './geometry/euclidean/trianglePerimeter';
import { triangleAreaV2 } from './geometry/euclidean/triangleAreaV2';
import { circleArea } from './geometry/euclidean/circleArea';
import { circleCircumference } from './geometry/euclidean/circleCircumference';
import { distanceBetweenTwoPoints } from './geometry/cartesian/distanceBetweenTwoPoints';
import { reduceExpression } from './calculLitteral/simplifying/reduceExpression';
import { evaluateExpression } from './calculLitteral/simplifying/evaluateExpression';
import { proportionalityTable } from './calcul/proportionality/proportionalityTable';
import { imageFunction } from './functions/basics/imageFunction';
import { triangleArea } from './geometry/euclidean/triangleArea';
import { lnDerivativeOne } from './derivation/derivative/lnDerivativeOne';
import { lnDerivativeTwo } from './derivation/derivative/lnDerivativeTwo';
import { lnDerivativeThree } from './derivation/derivative/lnDerivativeThree';
import { expDerivativeOne } from './derivation/derivative/expDerivativeOne';
import { expDerivativeTwo } from './derivation/derivative/expDerivativeTwo';
import { expDerivativeThree } from './derivation/derivative/expDerivativeThree';
import { logEquation } from './calculLitteral/equation/logEquation';
import { expEquation } from './calculLitteral/equation/expEquation';
import { expSimplifiying } from './calculLitteral/simplifying/expSimplifiying';
import { logSimplifiying } from './calculLitteral/simplifying/logSimplifiying';
import { quartiles } from '#root/exercises/probaStat/quartiles';
import { quartilesList } from '#root/exercises/probaStat/quartilesList';
import { euclideanDivision } from '#root/exercises/calcul/arithmetics/euclideanDivision';
import { thirdDegreeFunctionVariation } from '#root/exercises/derivation/derivative/thirdDegreeFunctionVariation';
import { polynomLimit } from '#root/exercises/limits/polynomLimit';
import { constantPrimitive } from '#root/exercises/primitve/constantPrimitive';
import { polynomialPrimitive } from '#root/exercises/primitve/polynomialPrimitive';
import { sinCosPrimitive } from '#root/exercises/primitve/sinCosPrimitive';
import { exponentialPrimitive } from '#root/exercises/primitve/exponentialPrimitive';
import { logarithmePrimitive } from '#root/exercises/primitve/logarithmePrimitive';
import { usualPrimitives } from '#root/exercises/primitve/usualPrimitives';
import { exponentialDifferentialEquation } from '#root/exercises/equaDiff/equaDiffGeneralForme';
import { exponentialDifferentialEquationWithIC } from '#root/exercises/equaDiff/equaDiffGeneralFormeWithIC';
import { mainRemarkableValuesExercise } from './trigonometry/mainRemarkableValues';
import { remarkableValuesExercise } from './trigonometry/remarkableValues';
import { leadingCoefficientCalculV1 } from './functions/affines/leadingCoefficientCalculV1';
import { leadingCoefficientCalculV2 } from './functions/affines/leadingCoefficientCalculV2';
import { inverseImageFunction } from './functions/basics/inverseImageFunction';
import { imageFunctionGeogebra } from './functions/basics/imageFunctionGeogebra';
import { inverseImageFunctionGeogebra } from './functions/basics/inverseImageFunctionGeogebra';
import { signFunction } from './functions/affines/signFunction';
import { alphaBetaInCanonicalForm } from './functions/trinoms/alphaBetaInCanonicalForm';
import { canonicalFromDevForm } from './functions/trinoms/canonicalFromDevForm';
import { alphaBetaFromDevForm } from './functions/trinoms/alphaBetaFromDevForm';
import { extremumFromCanonicalForm } from './functions/trinoms/extremumFromCanonicalForm';
import { extremumTypeFromAlgebricForm } from './functions/trinoms/extremumTypeFromAlgebricForm';
import { variationsFromAlgebricForm } from './functions/trinoms/variationsFromAlgebricForm';
import { mutiplyComplex } from './complex/mutiplyComplex';
import { reAndIm } from './complex/reAndIm';
import { addComplex } from './complex/addComplex';
import { averageWithTable } from './probaStat/averageWithTable';
import { medianWithList } from './probaStat/medianList';
import { medianWithTable } from './probaStat/median';
import { conjugateComplex } from './complex/conjugateComplex.ts';
import { conjugateMultiplyComplex } from './complex/conjugateMultiplyComplex';
import { inverseComplex } from './complex/inverseComplex';
import { divideComplex } from './complex/divideComplex';
import { conjugateDivideComplex } from './complex/conjugateDivideComplex';
import { firstIntegersSum } from './sequences/arithmetic/firstIntegersSum';
import { geometricFirstTermsSum } from './sequences/geometric/geometricFirstTermsSum';
import { squareRootEquation } from './squareRoots/squareRootEquation';
import { cubicEquation } from './functions/cube/cubicEquation';
import { determinant } from './geometry/vectors/determinant';
import { firstDegreeInequationsType1 } from './calculLitteral/inequations/firstDegreeInequationsType1';
import { firstDegreeInequationsType2 } from './calculLitteral/inequations/firstDegreeInequationsType2';
import { firstDegreeInequationsType3 } from './calculLitteral/inequations/firstDegreeInequationsType3';
import { firstDegreeInequationsType0 } from './calculLitteral/inequations/firstDegreeInequationsType0';
import { chasles } from './geometry/vectors/chasles';
import { deltaTrinom } from './functions/trinoms/deltaTrinom';
import { rootsFromFactorizedForm } from './functions/trinoms/rootsFromFactorizedForm';
import { rootsFromDevForm } from './functions/trinoms/rootsFromDevForm';
import { inequalityToInterval } from './sets/intervals/inequalityToInterval';
import { setBelonging } from './sets/setBelonging';
import { intervalsUnion } from './sets/intervals/intervalsUnion';
import { intervalsIntersection } from './sets/intervals/intervalsIntersection';
import { sequencePolynomLimit } from './limits/sequencePolynomLimit';
import { sequenceRationalFracLimit } from './limits/sequenceRationalFracLimit';
import { sequencePolynomProductLimit } from './limits/sequencePolynomProductLimit';
import { sequencePolynomNoFILimit } from './limits/sequencePolynomNoFILimit';
import { MathExercise } from './exercise';
import { polynomLimitNoFI } from './limits/polynomLimitNoFI';
import { rationalFracLimit } from './limits/rationalFracLimit';
import { rationalFracForbiddenValueLimit } from './limits/rationalFracForbiddenValueLimit';
import { sequenceGeometricLimit } from './limits/sequenceGeometricLimit';
import { calculatePower } from './powers/calculatePower';
import { calculateNegativePower } from './powers/calculateNegativePower';
import { decimalToScientific } from './powers/decimalToScientific';
import { powerDefinition } from './powers/powerDefinition';
import { niceRootsFromDevForm } from './functions/trinoms/niceRootsFromDevForm';
import { diceBasicProbas } from './probaStat/diceBasicProbas';
import { cardBasicProbas } from './probaStat/cardBasicProbas';
import { ballsBasicProbas } from './probaStat/ballsBasicProbas';

export const exercises: MathExercise[] = [
  /**
   * calcul litteral
   */
  factoType1Exercise,
  factoIdRmq1,
  factoIdRmq2,
  factoIdRmq3,
  simpleDistributivity,
  doubleDistributivity,
  firstIdentity,
  secondIdentity,
  thirdIdentity,
  allIdentities,

  /**
   * equations
   */
  equationType1Exercise,
  equationType2Exercise,
  equationType3Exercise,
  equationType4Exercise,
  firstDegreeEquation,
  equationSimpleSquare,

  /**
   * inequations
   */
  firstDegreeInequationsType0,
  firstDegreeInequationsType1,
  firstDegreeInequationsType2,
  firstDegreeInequationsType3,
  /**
   * square roots
   */
  simplifySquareRoot,
  squareRootEquation,

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
  addAndSubExercise,
  addAndSubWithoutRelatives,
  operationsPriorities,
  operationsPrioritiesWithoutRelative,

  /**
   * rounding
   */
  roundToCentieme,
  roundToDixieme,
  roundToMillieme,
  roundToUnit,
  allRoundings,

  /**
   * pourcentages
   */
  applyPercent,
  globalPercent,
  reciprocalPercentage,
  averageEvolutionRate,

  /**
   * geometry
   */
  midpoint,
  mainRemarkableValuesExercise,
  remarkableValuesExercise,
  thales,
  thalesCalcul,
  pythagore,
  pythagoreCalcul,
  trigonometry,
  trigonometryAngleCalcul,
  trigonometrySideCalcul,
  rightTriangleArea,
  triangleArea,

  /**
   * vectors
   */
  scalarProductViaCoords,
  determinant,
  chasles,
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
  decimalToScientific,
  powersOfTenToDecimal,
  calculatePower,
  calculateNegativePower,
  powerDefinition,
  /**
   * suites
   */
  geometricExplicitFormulaUsage,
  geometricFindReason,
  geometricFindExplicitFormula,
  geometricReasonUsage,
  geometricRecurrenceFormulaUsage,
  arithmeticExplicitFormulaUsage,
  arithmeticFindExplicitFormula,
  arithmeticFindReason,
  arithmeticReasonUsage,
  arithmeticRecurrenceFormulaUsage,
  arithmeticThresholdFind,
  firstIntegersSum,
  geometricFirstTermsSum,

  /**
   * fonctions
   */
  cubicEquation,
  imageFunction,
  inverseImageFunction,
  imageFunctionGeogebra,
  inverseImageFunctionGeogebra,

  /**
   * derivation
   */
  usualDerivative,
  constanteDerivative,
  firstDegreeDerivative,
  secondDegreeDerivative,
  thirdDegreeDerivative,
  inverseFunctionDerivative,
  rootFunctionDerivative,
  powerFunctionDerivative,
  derivativeNumberReading,
  lnDerivativeOne,
  lnDerivativeTwo,
  lnDerivativeThree,
  expDerivativeOne,
  expDerivativeTwo,
  expDerivativeThree,

  /**
   * primitive
   */
  constantPrimitive,
  polynomialPrimitive,
  sinCosPrimitive,
  exponentialPrimitive,
  logarithmePrimitive,
  usualPrimitives,

  /**
   * probabilités
   */
  probabilityTree,
  conditionalProbability,
  diceBasicProbas,
  cardBasicProbas,
  ballsBasicProbas,
  /**
   * islam
   */

  leadingCoefficient,
  fractionToPercentToDecimal,
  marginalAndConditionalFrequency,
  mentalAddAndSub,
  mentalMultiplications,
  mentalDivisions,
  mentalPercentage,

  /**
   * nv generateurs
   */

  capacityConversion,
  lengthConversion,
  massConversion,
  aeraConversion,
  volumeConversion,
  volumeCapacityConversion,
  primeNumbers,
  multiplicationEquation,
  fractionEquation,
  leadingCoefficientCalculV1,
  leadingCoefficientCalculV2,
  rectangleArea,
  rectanglePerimeter,
  squareArea,
  squarePerimeter,
  triangleAreaV2,
  trianglePerimeter,
  circleArea,
  circleCircumference,
  distanceBetweenTwoPoints,
  reduceExpression,
  evaluateExpression,
  proportionalityTable,

  logEquation,
  expEquation,
  expSimplifiying,
  logSimplifiying,

  euclideanDivision,
  signFunction,
  thirdDegreeFunctionVariation,

  exponentialDifferentialEquation,
  exponentialDifferentialEquationWithIC,

  /**Stats */
  averageWithTable,
  medianWithList,
  quartiles,
  medianWithTable,
  quartilesList,

  /**Trinomes */
  alphaBetaInCanonicalForm,
  canonicalFromDevForm,
  alphaBetaFromDevForm,
  extremumFromCanonicalForm,
  extremumTypeFromAlgebricForm,
  variationsFromAlgebricForm,
  deltaTrinom,
  rootsFromFactorizedForm,
  rootsFromDevForm,
  niceRootsFromDevForm,

  /**Complexes */
  mutiplyComplex,
  reAndIm,
  addComplex,
  conjugateComplex,
  conjugateMultiplyComplex,
  inverseComplex,
  divideComplex,
  conjugateDivideComplex,

  /**sets */
  inequalityToInterval,
  setBelonging,
  intervalsUnion,
  intervalsIntersection,

  /**limites */
  polynomLimit,
  polynomLimitNoFI,
  rationalFracLimit,
  rationalFracForbiddenValueLimit,
  sequencePolynomLimit,
  sequencePolynomNoFILimit,
  sequenceRationalFracLimit,
  sequencePolynomProductLimit,
  sequenceGeometricLimit,
];
