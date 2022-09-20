import { DocumentConventions, DocumentStore, IMetadataDictionary, Json, ResetIndexOperation, SqlConnectionString } from "ravendb";
import fs from "fs";
import path from "path";
import { BulkInsertOperation, BulkInsertOptions } from "ravendb/dist/Documents/BulkInsertOperation";
import { Sequence } from "./model";
import _ from "lodash";

interface QueueValue {
    sequence: Sequence,
    index: number,
}

export class DB {
    _docStoreAddress = "https://a.free.m4r6i0.ravendb.cloud";
    _docStorageDataName = "lotus";
    _docPsw = "432E3C266F593211EEB6B83AE69C42E5";
    _sequences?: Sequence[];
    _documentName?: string;
    _isResetIndex?: boolean;

    constructor(listSequences?: Sequence[], docName?: string, resetIndex?: boolean) {
        this._sequences = listSequences;
        this._documentName = docName;
        this._isResetIndex = resetIndex;
    }

    private get IsResetIndex(): boolean {
        return this._isResetIndex ?? false;
    }

    private get documentName(): string {
        return `${this._documentName}/`;
    }

    private get docStorage(): string {
        return this._docStoreAddress;
    }

    private get docStorageDatabase(): string {
        return this._docStorageDataName;
    }

    private get docStoragePassword(): string {
        return this._docPsw;
    }

    private get localePfxFile(): string {
        return path.join(__dirname, "cert", "free.m4r6i0.client.certificate.with.password.pfx");
    }

    private get authenticateOptions(): Object {
        const authOptions = {
            type: "pfx",
            certificate: fs.readFileSync(this.localePfxFile),
            password: this.docStoragePassword,
        }
        return authOptions;
    }

    private get listSequences() {
        return this._sequences;
    }

    private get Store(): DocumentStore {
        const store = new DocumentStore(this.docStorage, this.docStorageDatabase, this.authenticateOptions);
        store.initialize();
        return store;
    }

    private get bulkaOptions(): BulkInsertOptions {
        return {
            useCompression: true,
        }
    }

    async getAsyncAllSequencesOrderbyRank(): Promise<Sequence[]> {
        const session = this.Store.openSession();
        //
        const result = await session.query({
            collection: "Sequences"
        }).orderBy("rankId", "Long").all() as Sequence[];
        //
        return result;
    }

    async getAsyncSequencesBySequenceNumbers(seq: Sequence): Promise<Sequence[]> {
        const session = this.Store.openSession();
        //
        const result = await session.query({
            collection: "Sequences"
        }).whereEquals("n1", seq.n1)
            .whereEquals("n2", seq.n2)
            .whereEquals("n3", seq.n3)
            .whereEquals("n4", seq.n4)
            .whereEquals("n5", seq.n5)
            .whereEquals("n6", seq.n6).all() as Sequence[];
        //
        return result;
    }

    async saveAsyncSequence() {
        if (this.IsResetIndex)
            this.resetIndex();

        if (!this._sequences) {
            return;
        }
        const chunks = _.chunk(this._sequences, 1000000);
        let i = 1;

        for (const chunk of chunks) {
            const bulk = this.Store.bulkInsert(this.bulkaOptions);

            for (const sequence of chunk) {
                const seqId = `${this.documentName}${i++}`;
                console.log(seqId);
                await bulk.store(sequence, seqId);
            }
            await bulk.finish();
        }
    }

    private async resetIndex() {
        await this.Store.maintenance.send(await new ResetIndexOperation(this.documentName.replace("/", "")));
    }
}