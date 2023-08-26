// CounterStore.ts
import { observable, action } from 'mobx';

class Store {
    @observable count = 0;

    @action increment() {
        this.count += 1;
    }

    @action decrement() {
        this.count -= 1;
    }
}

const Stores = new Store();
export default Stores;