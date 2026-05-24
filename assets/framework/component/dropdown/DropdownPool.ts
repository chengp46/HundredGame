import { NodePool, Node, Prefab, instantiate } from 'cc';

export class DropdownPool {
    private pool = new NodePool();
    private prefab: Prefab;

    constructor(prefab: Prefab) {
        this.prefab = prefab;
    }

    public get(): Node {
        if (this.pool.size() > 0) {
            return this.pool.get();
        }
        return instantiate(this.prefab);
    }

    public put(node: Node) {
        if (!node) {
            return;
        }
        node.removeFromParent();
        this.pool.put(node);
    }

    public clear() {
        this.pool.clear();
    }
}