import { DocumentConventions, DocumentStore, IMetadataDictionary, Json, ResetIndexOperation, SqlConnectionString } from "ravendb";
import fs from "fs";
import path from "path";
import { BulkInsertOperation, BulkInsertOptions } from "ravendb/dist/Documents/BulkInsertOperation";
import { Sequence } from "./model";

export class DB {

    _docStoreAddress = "https://a.free.m4r6i0.ravendb.cloud";
    _docStorageDataName = "lotus";
    _docPsw = "432E3C266F593211EEB6B83AE69C42E5";
    _sequences: Sequence[];
    _documentName: string;
    _isResetIndex: boolean;

    constructor(listSequences: Sequence[], docName: string, resetIndex: boolean) {
        this._sequences = listSequences;
        this._documentName = docName;
        this._isResetIndex = resetIndex;
    }

    get IsResetIndex(): boolean { 
        return this._isResetIndex;
    }

    get documentName() : string { 
        return `${this._documentName}/`;
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

    get localePfxFile(): string {
        return path.join(__dirname, "cert", "free.m4r6i0.client.certificate.with.password.pfx");
    }

    get authenticateOptions(): Object {
        const authOptions = {
            type: "pfx",
            certificate: fs.readFileSync(this.localePfxFile),
            password: this.docStoragePassword,
        }
        return authOptions;
    }

    get listSequences() {
        return this._sequences;
    }

    get Store(): DocumentStore { 
        const store = new DocumentStore(this.docStorage, this.docStorageDatabase, this.authenticateOptions);
        store.initialize();
        return store;
    }

    get bulkaOptions(): BulkInsertOptions {
        return {
            useCompression: true,
        }
    }

    get bulka(): BulkInsertOperation { 
        return this.Store.bulkInsert(this.bulkaOptions);
    }

    async createAsyncSequence() {
        if(this.IsResetIndex)
            this.resetIndex();

        const session = this.Store.openSession(this.docStorageDatabase);

        if(this.listSequences) { 
            console.log('createAsyncSequence')

            this.listSequences.forEach(async (seq, i)=> {
                const seqId = `${this.documentName}${i}`;
                //console.log(this.changeSequenceObject(seq));
                //console.log(seq);
                //await this.bulka.store(this.changeSequenceObject(seq), seqId);
                
                await this.bulka.store(seq, seqId)
                
            })
        }
        await this.bulka.finish();
    }

    private async resetIndex() {
        await this.Store.maintenance.send(await new ResetIndexOperation(this.documentName.replace("/", "")));
    }
}