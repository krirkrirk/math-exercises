import { randint } from "#root/math/utils/random/randint";

export enum ClosureType {
  FF,
  FO,
  OF,
  OO,
}

export abstract class Closure {
  static random() {
    const rand = randint(0, 4);
    switch (rand) {
      case 0:
        return ClosureType.FF;
      case 1:
        return ClosureType.FO;
      case 2:
        return ClosureType.OF;
      case 3:
      default:
        return ClosureType.OO;
    }
  }
  static reverse(closure: ClosureType) {
    switch (closure) {
      case ClosureType.FF:
        return ClosureType.OO;
      case ClosureType.OO:
        return ClosureType.FF;
      case ClosureType.FO:
        return ClosureType.OF;
      case ClosureType.OF:
        return ClosureType.FO;
    }
  }
  static leftReverse(closure: ClosureType) {
    switch (closure) {
      case ClosureType.FF:
        return ClosureType.OF;
      case ClosureType.OO:
        return ClosureType.FO;
      case ClosureType.FO:
        return ClosureType.OO;
      case ClosureType.OF:
        return ClosureType.FF;
    }
  }
  static rightReverse(closure: ClosureType) {
    switch (closure) {
      case ClosureType.OF:
        return ClosureType.OO;
      case ClosureType.OO:
        return ClosureType.OF;
      case ClosureType.FO:
        return ClosureType.FF;
      case ClosureType.FF:
        return ClosureType.FO;
    }
  }
  static switch(closure: ClosureType) {
    switch (closure) {
      case ClosureType.FF:
        return ClosureType.FF;
      case ClosureType.OO:
        return ClosureType.OO;
      case ClosureType.FO:
        return ClosureType.OF;
      case ClosureType.OF:
        return ClosureType.FO;
    }
  }
  static fromBrackets(left: "[" | "]", right: "]" | "[") {
    if (left === "[")
      if (right === "]") return ClosureType.FF;
      else return ClosureType.FO;
    else if (right === "[") return ClosureType.OO;
    else return ClosureType.OF;
  }

  static isLeftOpen(closure: ClosureType) {
    switch (closure) {
      case ClosureType.FF:
      case ClosureType.FO:
        return false;
      case ClosureType.OF:
      case ClosureType.OO:
        return true;
    }
  }
  static isRightOpen(closure: ClosureType) {
    switch (closure) {
      case ClosureType.FF:
      case ClosureType.OF:
        return false;
      case ClosureType.OO:
      case ClosureType.FO:
        return true;
    }
  }
}
