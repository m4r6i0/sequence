export class Sequence { 
    
    public rankId: number;
    public n1: number;
    public n2: number;
    public n3: number;
    public n4: number;
    public n5: number;
    public n6: number;
    public gameOver: boolean;

    constructor(rankId: number, s1: number, s2: number, s3: number, s4: number, s5: number, s6: number) {
        this.rankId = rankId;
        this.n1 = s1;
        this.n2 = s2;
        this.n3 = s3;
        this.n4 = s4;
        this.n5 = s5;
        this.n6 = s6;
        this.gameOver = false;
    }
}