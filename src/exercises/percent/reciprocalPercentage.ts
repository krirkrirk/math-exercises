import { randint } from "#root/math/utils/random/randint";
import { round } from "mathjs";
import { Exercise, Question } from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

export const reciprocalPercentage: Exercise = {
    id: 'reciprocalPercentage',
    connector: '=',
    instruction: "",
    label: "Calculer un taux d'évolution réciproque",
    levels: ['4', '3', '2'],
    section: 'Pourcentages',
    isSingleStep: false,
    generator: (nb: number) => getDistinctQuestions(getReciprocalPercentageQuestion, nb),
};

export function getReciprocalPercentageQuestion(): Question {
    
    const randPercent = randint (1, 50);
    const tab = ["hausse", "baisse"];
    let ans = 0;
    let a = randint(0,2);
    let instruction = `Le prix d'un article subit une ${tab[a]} de $${randPercent}\\%$. Quelle évolution devra-t-il subir pour revenir à son prix initial ?`;

    if (a == 1)
        ans = (1 - 1 / (1 + randPercent / 100)) * 100;
    else
        ans = (1 - 1 / (1 - randPercent / 100)) * 100;
    
    ans = round(ans, 2);
    const answer = `${ans} \\%`;

    const question: Question = {
        instruction,
        answer, 
    };

    return question;
}