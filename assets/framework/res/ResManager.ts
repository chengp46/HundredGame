import { Node } from "cc";
import { ScopeManager } from "./ScopeManager";

export class ResManager {

    static async openUI(scopeName: string, bundle: string, path: string, parent: Node) {
        const scope = ScopeManager.create(scopeName);
        return scope.openUI(bundle, path, parent);
    }

    static closeScope(name: string) {
        ScopeManager.destroy(name);
    }

    static closeAll() {
        ScopeManager.destroyAll();
    }
}

/*
await ResManager.openUI("hall", "hall", "ui/HallView", this.node);

进入子游戏
await ResManager.openUI( "slot1001", "slot1001","ui/Main", this.node);

退出子游戏（自动释放全部）
ResManager.closeScope("slot1001");

*/