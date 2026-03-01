import { Asset } from "cc";
import { SceneMgr } from "./SceneManager";

export class UIResource {
    resPath: string;
    bundle: string;
}

type Constructor<T = {}> = { new(...args: any[]): any };
export type __TYPE__<T> = new (...args: any[]) => T;
export function DialogResource(path: string, bundle: string) {
    return <T extends Constructor>(dialog: T) => {
        let uiRes = SceneMgr.ResourceMap.get(dialog.name);
        if (!uiRes) {
            uiRes = new UIResource();
            uiRes.resPath = path;
            uiRes.bundle = bundle;
            SceneMgr.ResourceMap.set(dialog.name, uiRes);
        }
        return dialog;
    }
}




