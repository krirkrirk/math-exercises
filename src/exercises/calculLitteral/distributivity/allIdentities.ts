import { random } from "../../../utils/random";
import { Exercise, Question } from "../../exercise";
import { getDistinctQuestions } from "../../utils/getDistinctQuestions";
import { getFirstIdentityQuestion } from "./firstIdentity";
import { getSecondIdentityQuestion } from "./secondIdentity";
import { getThirdIdentityQuestion } from "./thirdIdentity";

export const allIdentities: Exercise = {
  id: "allIdRmq",
  connector: "=",
  instruction: "Développer et réduire :",
  label: "Identités remarquables (toutes)",
  levels: ["3", "2"],
  section: "Calcul Littéral",
  generator: (nb: number) => getDistinctQuestions(getAllIdentitiesQuestion, nb),
};

export function getAllIdentitiesQuestion(): Question {
  const rand = random([1, 2, 3]);
  return rand === 1
    ? getFirstIdentityQuestion()
    : rand === 2
    ? getSecondIdentityQuestion()
    : getThirdIdentityQuestion();
}
