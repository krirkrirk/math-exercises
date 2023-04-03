import { randint } from "#root/math/utils/random/randint";
import { round } from "#root/math/utils/round";
import { coinFlip } from "#root/utils/coinFlip";
import { Exercise, Question } from "../exercise";
import { getDistinctQuestions } from "../utils/getDistinctQuestions";

export const applyPercent: Exercise = {
    id: 'applyPercent',
    connector: '=',
    instruction: "",
    label: "Appliquer un pourcentage d'augmentation ou de diminution.",
    levels: ['4', '3', '2'],
    section: 'Pourcentages',
    isSingleStep: false,
    generator: (nb: number) => getDistinctQuestions(getApplyPercentQuestion, nb),
};

export function getApplyPercentQuestion(): Question {

    const randNbr = randint (1,500);
    const randPercent = randint (1,100);
    const flip = coinFlip();
    let instruction = "";
    let answer = "";
    let ans = 0;

    if (flip){
        ans = randNbr * (1 + randPercent/100);
        ans = round(ans, 2);
        instruction = `Appliquer une augmentation de $${randPercent}\\%$ à $${randNbr}$ :`;
    }
    else{
        ans = randNbr * (1 - randPercent/100);
        ans = round(ans, 2);
        instruction = `Appliquer une diminution de $${randPercent}\\%$ à $${randNbr}$ :`;
    }
    
    const question: Question = {
        instruction,
        answer: ans.toString(),
    };

    return question;
}