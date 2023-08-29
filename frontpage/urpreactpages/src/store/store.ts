// CounterStore.ts
import IdfStore from "./IdfStore";
import EpwStore from "./EpwStore";

class Stores {
    idfStore: IdfStore; // 声明 idfStore 的类型
    epwStore: EpwStore;
    constructor() {
        this.idfStore = new IdfStore(); // 创建 idfStore 实例
        this.epwStore = new EpwStore()
    }
}

const RootStore = new Stores();
export default RootStore;
