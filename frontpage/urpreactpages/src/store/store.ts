// CounterStore.ts
import IdfStore from "./IdfStore";

class Stores {
    idfStore: IdfStore; // 声明 idfStore 的类型

    constructor() {
        this.idfStore = new IdfStore(); // 创建 idfStore 实例
    }
}

const RootStore = new Stores();
export default RootStore;
