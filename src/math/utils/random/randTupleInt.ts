import { arrayEqual } from "../../utils/arrayEqual";
import { randint } from "./randint";

interface randTupleIntOptions{
    from: number;
    to?: number;
    excludes?: number[];
}

/**
 * @param size tuple length
 * @param options 
 * @returns array of size nb with contents = randint(from, to, exxcludes)
 */
export const randTupleInt = (size: number, options: randTupleIntOptions) :  number[] => {
    const res = [];
    for(let i = 0; i< size; i++){
        res.push(randint(options.from, options.to, options.excludes))
    }
    return res;
}

export const distinctRandTupleInt = (nb: number, size: number, options: randTupleIntOptions) : number[][]=>{
    const res: number[][] = [];
    for(let i = 0; i< nb; i++){
        let newTuple : number[];
        do{
            newTuple = randTupleInt(size, options);
        } while(res.some(tuple=>
                arrayEqual(tuple, newTuple)
            ));
        res.push(newTuple)

        
    }
    return res;
}