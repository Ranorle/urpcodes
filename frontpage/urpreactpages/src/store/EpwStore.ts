// IdfStore.ts
import { makeAutoObservable } from 'mobx';

export type idfObjectType={
    Id:number,
    EpwName:string,
    EpwPath:string,
    Location:string,
}

export type epwpreviewType={
    dry_bulb_temperature :string
    dew_point_temperature :string
    relative_humidity: string
    atmospheric_pressure:string
    wind_speed:string
    wind_direction:string

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

    epwpreviewobject:epwpreviewType={
        dry_bulb_temperature :'',
        dew_point_temperature :'',
        relative_humidity:'',
        atmospheric_pressure:'',
        wind_speed:'',
        wind_direction:'',
    }


    //actions
    changeepwObject(value: idfObjectType) {
        this.epwObject = value;
    }
    changeepwArray(value: idfObjectType[]) {
        this.epwArray = value;
    }
    changedry_bulb_temperature_day(value: epwpreviewType) {
        this.epwpreviewobject = value;
    }
}

export default EpwStore;