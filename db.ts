import { DocumentStore } from "ravendb";
import fs from "fs";

export class DB {

    _docStoreAddress = "https://a.free.m4r6i0.ravendb.cloud";
    _docStorageDataName = "lotus";
    _docPsw = "432E3C266F593211EEB6B83AE69C42E5";
    _sequences: [];

    constructor(listSequences: any) {
        this._sequences = listSequences;
    }

    get docStorage(): string {
        return this._docStoreAddress;
    }

    get docStorageDatabase(): string {
        return this._docStorageDataName;
    }

    get docStoragePassword(): string {
        return this._docPsw;
    }

    get authenticateOptions(): Object {
        const authOptions = {
            type: "pfx",
            certificate: fs.readFileSync("C:\\source\\mega\\cert\\free.m4r6i0.client.certificate.with.password.pfx"),
            password: this.docStoragePassword,
        }
        return authOptions;
    }

    get listSequences() {
        return this._sequences;
    }

    get Store(): DocumentStore { 
        const store = new DocumentStore(this.docStorage, this.docStorageDatabase, this.authenticateOptions);
        store.conventions.findCollectionNameForObjectLiteral = entity => entity["collection"];
        store.initialize();
        return store;
    }


    async createAsyncSequence() {
        const session = this.Store.openSession(this.docStorageDatabase);

        if(this.listSequences) { 
            console.log('createAsyncSequence')
            this.listSequences.forEach((seq)=> {
                session.store(seq);
            })
        }
        await session.saveChanges();
        
        // session.saveChanges().then(result => {
        //     console.log('save OK');
        //     console.log(result)
        // }).catch(e => {
        //     console.log('exception error');
        //     console.log(e);
        // })
    }

    createStoreSequence() {
        // const session = this.Store.openSession();
        // session.load(".").then((p)=> {
        //     console.log(p);
        // }).catch((e)=> {
        //     console.warn(e);
        // });
       

        // session.load('users/1-A').then((user)=> {
        //     console.log(msg.blue(user));
        // }).catch(e => {
        //     console.warn(msg.red(e));
        // })
    }
}