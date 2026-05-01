import { Node, instantiate } from "cc";
import { AssetLoader } from "./AssetLoader";
import { RefGraph } from "./RefGraph";
import { BundleManager } from "./BundleManager";
import { AutoRelease } from "./AutoRelease";

export class AutoReleaseScope {

    readonly name: string;

    private nodes: Node[] = [];
    private assets: string[] = [];
    private bundles = new Set<string>();

    constructor(name: string) {
        this.name = name;
    }

    //--------------------------------
    // 打开UI
    //--------------------------------
    async openUI(bundle: string, path: string, parent: Node) {
        const prefab = await AssetLoader.loadPrefab(bundle, path);
        RefGraph.retain(prefab);

        this.assets.push(prefab.uuid);
        this.bundles.add(bundle);

        const node = instantiate(prefab);
        parent.addChild(node);

        const ar = node.addComponent(AutoRelease);
        ar.init(prefab.uuid);
        this.nodes.push(node);
        return node;
    }

    //--------------------------------
    // destroy scope
    //--------------------------------
    destroy() {
        console.log(`[Scope Destroy] ${this.name}`);
        for (const n of this.nodes) {
            if (n && n.isValid)
                n.destroy();
        }

        this.nodes.length = 0;
        for (const uuid of this.assets) {
            RefGraph.release(uuid);
        }

        this.assets.length = 0;
        this.bundles.forEach(b =>
            BundleManager.remove(b)
        );
        this.bundles.clear();
    }
}