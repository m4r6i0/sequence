export class App {

    constructor() {
        this.main();
    }

    fatorial(n: number) : number {
        let result = 1;
        while(n > 0) { 
            result = result * n;
            n--;
        }
        return result;
    }
    
    main() {
    
        console.log('main()');
    
        // const n = this.getRndVol(4);
        // const p = this.getRndVol(5);
        const n = 4;
        const p = 5;
        const fatorialN = this.fatorial(n);
        const fatorialP = this.fatorial(p);
        const fatorialNP = this.fatorial(n-p);
    
        const result = fatorialN / (fatorialP * fatorialNP);
    
        console.log(result);
    }
    
    getRndVol(max: number): number {
        return Math.floor(Math.random() * max);
    }
}

let cls = new App();
cls.main();
