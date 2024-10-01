import { KeyId } from "./keyIds";

export type KeyProps = {
  id: KeyId;
  label: string;
  labelType: "raw" | "tex" | "svg";
  mathfieldInstructions?: MathfieldInstructions;
  onClick?: () => void;
};
export interface MathfieldInstructions {
  method: "write" | "cmd" | "keystroke" | "typedText";
  content: string | ((currentLatex: string) => string);
}
