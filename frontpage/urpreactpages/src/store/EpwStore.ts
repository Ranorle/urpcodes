// IdfStore.ts
import { makeAutoObservable } from 'mobx';

export type idfObjectType={
    Id:number,
    EpwName:string,
    EpwPath:string,
    Location:string,
}

class EpwStore {
    constructor() {
        makeAutoObservable(this)
    }

    //states
    epwObject: idfObjectType={
        Id:0,
        EpwName:'',
        EpwPath:'',
        Location:'116.47,39.80',
    }
    epwArray:idfObjectType[]=[{
        Id:0,
        EpwName:'',
        EpwPath:'',
        Location:'',
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