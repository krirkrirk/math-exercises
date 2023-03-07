import { Node } from '#root/tree/nodes/node';
import { Integer } from '../numbers/integer/integer';

enum SequenceType {
  arithmetic,
  geometric,
  other,
}

export class Sequence {
  type: SequenceType;
  firstRank: Integer = new Integer(0);
  firstTerm: Node;
  recurrenceFormula?: string;
  explicitFormula?: string;

  constructor({
    type,
    recurrenceFormula,
    explicitFormula,
    firstRank,
    firstTerm,
  }: {
    type: SequenceType;
    recurrenceFormula?: string;
    explicitFormula?: string;
    firstRank: Integer;
    firstTerm: Node;
  }) {
    this.type = type;
    this.firstTerm = firstTerm;
    this.recurrenceFormula = recurrenceFormula;
    this.explicitFormula = explicitFormula;
    this.firstRank = firstRank;
  }
}
