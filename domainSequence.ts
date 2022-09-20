import { SetRangeSequencesGame } from "./SetRangeSequencesGame";
import { DB } from "./db";
import { Sequence } from "./model";

export class domainSequence {
    _min: number = 0;
    _max: number = 0;
    _documentName = "Sequence";

    constructor(min: number, max: number) { 
        this._min = min;
        this._max = max;
    }

    get MininumsRange(): number {
        return this._min;
    }

    get MaximusRange(): number {
        return this._max;
    }

    get list() {
        const sequences = new SetRangeSequencesGame(this.MininumsRange, this.MaximusRange);
        return sequences.executeSequence();
    }

    async sendDataBase(sequences: Sequence[]) { 
        const database = new DB(sequences, this._documentName, false);
        await database.createAsyncSequence();
    }
}

const domain = new domainSequence(1, 10);
const result = domain.list;

console.log(result.length);

domain.sendDataBase(result).then(res=> {
    console.log('ok');
}).catch(e=>{
    console.log(e);
});