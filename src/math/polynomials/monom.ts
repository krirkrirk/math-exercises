import { Polynomial } from './polynomial';

export class Monom extends Polynomial {
  constructor(degree: number, coeff: number, variable: string = 'x') {
    const coeffs = [];
    for (let i = 0; i < degree; i++) coeffs.push(0);
    coeffs.push(coeff);
    super(coeffs, variable);
  }
}
