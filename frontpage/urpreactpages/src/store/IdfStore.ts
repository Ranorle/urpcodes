// IdfStore.ts
import { makeAutoObservable } from 'mobx';

export type idfObjectType={
    Id:number,
    IdfName:string,
    IdfPath:string,
}

class IdfStore {
    constructor() {
        makeAutoObservable(this)
    }

    //states
    idfObject: idfObjectType={
        Id:1,
        IdfName:'',
        IdfPath:'',
    }
    idfArray:idfObjectType[]=[{
        Id:1,
        IdfName:'',
        IdfPath:'',
    }]
    //actions
    changeidfObject(value: idfObjectType) {
        this.idfObject = value;
    }
    changeidfArray(value: idfObjectType[]) {
        this.idfArray = value;
    }
}

export default IdfStore;