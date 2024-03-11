import { FractionNode } from "#root/tree/nodes/operators/fractionNode";
import { Polynomial } from "./polynomial";
import { Rational } from "../numbers/rationals/rational";
import { NumberType } from "../numbers/nombre";
import { Integer } from "../numbers/integer/integer";
import { gcd } from "../utils/arithmetic/gcd";

export class RationalFrac {
  num: Polynomial;
  denum: Polynomial;
  constructor(num: Polynomial, denum: Polynomial) {
    this.num = num;
    this.denum = denum;
  }
  toTree() {
    return new FractionNode(this.num.toTree(), this.denum.toTree());
  }

  // isSimplified(){
  //   if (this.num.coefficients.length === 1 && this.num.coefficients[0] === 0)
  //   return true;
  // const numCoeffs = this.num.coefficients.filter((c) => c !== 0);
  // const numPGCD = numCoeffs.length > 1 ? gcd(...numCoeffs) : numCoeffs[0];
  // const denumCoeffs = this.denum.coefficients.filter((c) => c !== 0);
  // const denumPGCD =
  //   denumCoeffs.length > 1 ? gcd(...denumCoeffs) : denumCoeffs[0];
  // const rational = new Rational(numPGCD, denumPGCD);
  // if (rational.isIrreductible()) {
  //   return this;
  // }
  // }
  simplify() {
    if (this.num.coefficients.length === 1 && this.num.coefficients[0] === 0)
      return new Integer(0);
    const numCoeffs = this.num.coefficients.filter((c) => c !== 0);
    const numPGCD = numCoeffs.length > 1 ? gcd(...numCoeffs) : numCoeffs[0];
    const denumCoeffs = this.denum.coefficients.filter((c) => c !== 0);
    const denumPGCD =
      denumCoeffs.length > 1 ? gcd(...denumCoeffs) : denumCoeffs[0];
    const rational = new Rational(numPGCD, denumPGCD);
    if (rational.isIrreductible()) {
      return this;
    }
    const simplifiedRational = rational.simplify();
    const simplifiedNum = this.num.scalarDivide(numPGCD);
    const simplifiedDenum = this.denum.scalarDivide(denumPGCD);
    if (simplifiedDenum.equals(simplifiedNum)) {
      return simplifiedRational;
    } else {
      const denumHasOnlyMinus = simplifiedDenum.coefficients.every(
        (coeff) => coeff <= 0,
      );
      const trueDenum = denumHasOnlyMinus
        ? simplifiedDenum.times(-1)
        : simplifiedDenum;
      if (simplifiedRational.type === NumberType.Integer) {
        const int = simplifiedRational as Integer;
        return new RationalFrac(
          simplifiedNum.times(int.value * (denumHasOnlyMinus ? -1 : 1)),
          trueDenum,
        );
      } else {
        const frac = simplifiedRational as Rational;
        return new RationalFrac(
          simplifiedNum.times(frac.num * (denumHasOnlyMinus ? -1 : 1)),
          trueDenum.times(frac.denum),
        );
      }
    }
  }
}
