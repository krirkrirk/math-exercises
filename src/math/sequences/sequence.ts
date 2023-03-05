import { Node } from "src/tree/nodes/node";


enum SequenceType {
  arithmetic,
  geometric,
}

export class Sequence {
  type: SequenceType;
  firstTerm: Node;
  reason?: Node;
  recurrenceFormula? : string;
  explicitFormula?: string;
  
  constructor(type: SequenceType, firstTerm: Node, reason?: Node) {
    this.type = type;
    this.firstTerm = firstTerm;
    this.reason = reason;
    this.
  }
}
