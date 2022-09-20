import { SetRangeSequencesGame } from "./SetRangeSequencesGame";
import { DB } from "./db";
import { Sequence } from "./model";

export class domainSequence {
    _min?: number = 0;
    _max?: number = 0;
    _documentName = "Sequence";

    constructor(min?: number, max?: number) { 
        this._min = min;
        this._max = max;
    }

    get MininumsRange(): number {
        return this._min ?? 0;
    }

    get MaximusRange(): number {
        return this._max ?? 0;
    }

    get list() {
        const sequences = new SetRangeSequencesGame(this.MininumsRange, this.MaximusRange);
        return sequences.executeSequence();
    }

    async sendDataBase(sequences: Sequence[]) {
        const database = new DB(sequences, this._documentName, false);
        await database.saveAsyncSequence();
    }

   async listAllSequencesOrderbyRank() {
        const database = new DB();
        return await database.getAsyncAllSequencesOrderbyRank();
   }

   async listSequencesBySequenceNumber(sequence: Sequence) {
        const database = new DB();
        return await database.getAsyncSequencesBySequenceNumbers(sequence);
   }
}

/* LER DADOS FILTRADOS */
// const domain = new domainSequence();
// const seq = new Sequence(0, 1, 2, 4, 5, 7, 9);

// domain.listSequencesBySequenceNumber(seq).then((result) => {
//     console.log("Ler dados filtrados");
//     console.log(result);
// }).catch((e)=> {console.warn(e)});

/* LER TODOS DADOS */
// const domain = new domainSequence();
// domain.listAllSequencesOrderbyRank().then((result) => {
//     console.log("Ler dados Sequencies");
//     console.log(result);
// }).catch((e)=> {console.log(e)});


/* SALVAR DADOS */
const domain = new domainSequence(1, 20);
const result = domain.list;

console.log(result.length);

domain.sendDataBase(result).then(res=> {
    console.log('ok');
}).catch(e=>{
    console.log(e);
});