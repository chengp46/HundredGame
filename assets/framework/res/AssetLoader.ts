import { Asset, Prefab } from "cc";
import { BundleManager } from "./BundleManager";

export class AssetLoader {

    static async loadPrefab(bundle: string, path: string) {
        const b = await BundleManager.load(bundle);
        return new Promise<Prefab>((resolve, reject) => {
            b.load(path, Prefab, (err, prefab) => {
                if (err) reject(err);
                else resolve(prefab!);
            });

        });
    }

    static async loadAsset<T extends Asset>(bundle: string, path: string, type: any) {
        const b = await BundleManager.load(bundle);
        return new Promise<T>((resolve, reject) => {
            b.load(path, type, (err, asset) => {
                if (err) reject(err);
                else resolve(asset as T);
            });

        });
    }
}