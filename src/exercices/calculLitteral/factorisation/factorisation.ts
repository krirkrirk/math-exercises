import { Affine, AffineConstructor } from "../../../polynomials/affine";
import { shuffleArray } from "../../../utils/shuffleArray";
import { pm } from "../../utils/pm";

//type (ax+b)(cx+d)+(ax+b)(ex+f)
const getExo1Question = () => {
  const affines = AffineConstructor.differentRandoms(3);
  const permut = [shuffleArray([affines[0], affines[1]]), shuffleArray([affines[0], affines[2]])];

  //   statement = `${multiply(permut[0], permut[1])}${pm()}`;

  //   ans= aff[0] * reduce(aff[1] pm aff[2])
};
