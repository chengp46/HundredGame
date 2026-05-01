import { assetManager, AssetManager } from "cc";

export class BundleManager {

    private static bundles = new Map<string, AssetManager.Bundle>();

    static async load(name: string) {
        let bundle = this.bundles.get(name);
        if (bundle) return bundle;

        return new Promise<AssetManager.Bundle>((resolve, reject) => {
            assetManager.loadBundle(name, (err, b) => {
                if (err) reject(err);
                else {
                    this.bundles.set(name, b!);
                    resolve(b!);
                }
            });

        });
    }

    static remove(name: string) {
        const bundle = this.bundles.get(name);
        if (!bundle) return;
        assetManager.removeBundle(bundle);
        this.bundles.delete(name);
    }
}