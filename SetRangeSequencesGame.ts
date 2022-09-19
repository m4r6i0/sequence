import sql from 'alasql'

export class SetRangeSequencesGame {
    _min: number = 0 ;
    _max: number = 0;

    constructor(min: number, max: number) { 
        this._min = min;
        this._max = max;
    }
    
    get min(): number {
        return this._min;
    }

    get max(): number {
        return this._max;
    }

    get total(): number {
        return this.min + this.max;
    }

    get getQuerySequences(): string {
        return "select " + 
                  "s1.seq as n1, " +
                  "s2.seq as n2, " +
                  "s3.seq as n3, " +
                  "s4.seq as n4, " +
                  "s5.seq as n5, " +
                  "s6.seq as n6  " +
                  "from sequence s1 " + 
                  "   join sequence s2 on s2.seq > s1.seq " +
                  "   join sequence s3 on s3.seq > s2.seq " +
                  "   join sequence s4 on s4.seq > s3.seq " +
                  "   join sequence s5 on s5.seq > s4.seq " +
                  "   join sequence s6 on s6.seq > s5.seq " +
                  "where s1.seq <> 0 ";
    }

    createTableSequences() {

        const createTableSequence = "create table sequence (seq number)";
        sql(createTableSequence);

        const createArraySequence = [...new Array(this.total)].fill(this.min, this.max).map((e, i) => {
            const aux = "insert into sequence values(" + i + ")"
            return aux;
        });

        createArraySequence.forEach(insert => {
            sql(insert);
        });
    }
   
    executeSequence() {
        this.createTableSequences();
        return sql(this.getQuerySequences);
    }
}

// const app = new SetRangeSequencesGame(1, 10);
// const result = app.executeSequence();
// console.log(result.length);

// result.forEach((f)=> {
//     console.log(f);
// });
