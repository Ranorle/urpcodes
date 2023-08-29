// IdfStore.ts
import { makeAutoObservable } from 'mobx';

export type idfObjectType={
    Id:number,
    EpwName:string,
    EpwPath:string,
}

class EpwStore {
    constructor() {
        makeAutoObservable(this)
    }

    //states
    epwObject: idfObjectType={
        Id:1,
        EpwName:'',
        EpwPath:'',
    }
    epwArray:idfObjectType[]=[{
        Id:1,
        EpwName:'',
        EpwPath:'',
    }]
    //actions
    changeepwObject(value: idfObjectType) {
        this.epwObject = value;
    }
    changeepwArray(value: idfObjectType[]) {
        this.epwArray = value;
    }
}

export default EpwStore;