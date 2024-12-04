import { random } from "#root/utils/alea/random";
export type InegalitySymbols = "<" | ">" | "\\le" | "\\ge";

export abstract class InequationSymbolConstructor {
  static random() {
    return new InequationSymbol(random(["<", ">", "\\le", "\\ge"]));
  }
  static randomSymbol() {
    return random<InegalitySymbols>(["<", ">", "\\le", "\\ge"]);
  }
}
export class InequationSymbol {
  isStrict: boolean;
  isSup: boolean;
  symbol: InegalitySymbols;
  constructor(symbol: InegalitySymbols) {
    this.isStrict = symbol === ">" || symbol === "<";
    this.isSup = symbol === ">" || symbol === "\\ge";
    this.symbol = symbol;
  }
  reversed = (): InegalitySymbols => {
    switch (this.symbol) {
      case "<":
        return ">";
      case ">":
        return "<";
      case "\\ge":
        return "\\le";
      case "\\le":
        return "\\ge";
    }
  };
  toReversed = () => {
    return new InequationSymbol(this.reversed());
  };
  toStrictnessToggled = () => {
    return new InequationSymbol(this.strictnessToggled());
  };
  strictnessToggled = () => {
    switch (this.symbol) {
      case "<":
        return "\\le";
      case ">":
        return "\\ge";
      case "\\ge":
        return ">";
      case "\\le":
        return "<";
    }
  };
}
