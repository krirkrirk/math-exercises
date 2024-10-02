import { KeyId } from "./keyIds";

export type KeyProps = {
  id: KeyId;
  label: string;
  labelType: "raw" | "tex" | "svg";
  mathfieldInstructions?: MathfieldInstructions;
};
export interface MathfieldInstructions {
  method: "write" | "cmd" | "keystroke" | "typedText";
  content: string;
}
