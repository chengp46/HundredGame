import { Asset, assetManager } from "cc";

class RefNode {

    asset: Asset;
    refCount = 0;
    deps: string[] = [];

    constructor(asset: Asset) {
        this.asset = asset;
    }
}

export class RefGraph {

    private static nodes = new Map<string, RefNode>();


    static retain(asset: Asset) {
        const uuid = asset._uuid;
        let node = this.nodes.get(uuid);

        if (!node) {
            node = new RefNode(asset);
            // ⭐ 获取依赖链
            node.deps = assetManager.dependUtil.getDeps(uuid) || [];

            this.nodes.set(uuid, node);

            // retain 自身
            asset.addRef();

            // retain 依赖
            for (const dep of node.deps) {
                this.retainDep(dep);
            }
        }

        node.refCount++;
    }

    private static retainDep(uuid: string) {
        const asset = assetManager.assets.get(uuid);

        if (!asset) return;

        let node = this.nodes.get(uuid);
        if (!node) {
            node = new RefNode(asset);
            this.nodes.set(uuid, node);
            asset.addRef();
        }
        node.refCount++;
    }


    static release(uuid: string) {

        const node = this.nodes.get(uuid);
        if (!node) return;

        node.refCount--;

        if (node.refCount > 0) return;

        // release dependencies
        for (const dep of node.deps) {
            this.release(dep);
        }

        node.asset.decRef();
        this.nodes.delete(uuid);
    }

    static dump() {
        console.log("===== RefGraph =====");
        this.nodes.forEach((v, k) => {
            console.log(k, v.refCount);
        });
    }
}