import { director, Node, Prefab, isValid, game, Game, v3 } from "cc";
import { UIManager, UILayer, UIResourceRegistry, UICache, ScreenEvent, Constructor } from "./UIManager";

import { UIView } from "./UIView";
import { UIDialog } from "./UIDialog";
import { MessageMgr } from "../manager/MessageManager";
import { ResManager } from "../res/ResManager";
import { ResolutionManager } from "../boot/ResolutionManager";
import { WebFullscreen } from "../boot/WebFullscreen";
import { SafeAreaManager } from "../boot/SafeAreaManager";

export class SceneManager {
    static instance = new SceneManager();
    // 当前视图
    private currentScope = "";
    // 是否隐藏
    protected bHide = false;
    // 根节点
    private root!: Node;

    init(root: Node) {
        this.root = root;
        UIManager.init(root);
        // 进入后台时触发的事件
        game.on(Game.EVENT_HIDE, this.onEventShow, this);
        // 切换到前台事件
        game.on(Game.EVENT_SHOW, this.onEventShow, this);
        document.addEventListener("visibilitychange", this.onVisibilitychange.bind(this));
        WebFullscreen.init();
        ResolutionManager.instance.init();
        SafeAreaManager.apply();
    }

    onEventHide() {
        if (!this.bHide) {
            MessageMgr.dispatchEvent(ScreenEvent.EventShowAndHide, false);
            this.bHide = true;
        }
    }

    onEventShow() {
        if (this.bHide) {
            MessageMgr.dispatchEvent(ScreenEvent.EventShowAndHide, true);
            this.bHide = false;
        }
    }

    onVisibilitychange() {
        if (document.hidden) {
            this.onEventHide();
        } else {
            this.onEventShow();
        }
    }

    pauseAnimation(nodes: any[]) {
        for (const node of nodes) {
            const anim = node.getComponent(Animation);
            if (anim) {
                anim.pause();
            }
            this.pauseAnimation(node.children);
        }
    }

    resumeAnimation(nodes: any[]) {
        for (const node of nodes) {
            const anim = node.getComponent(Animation);
            if (anim) {
                anim.resume();
            }
            this.resumeAnimation(node.children);
        }
    }

    /*================ View =================*/
    async loadView(scope: string, bundle: string, path: string) {
        const layer = UIManager.layer(UILayer.CONTENT);
        const node = await ResManager.openUI(scope, bundle, path, layer);
        this.currentScope = scope;
    }

    async changeView<T extends UIView>(type: Constructor<T>, callback?: (view: T) => T | void) {
        const res = UIResourceRegistry.get(type);
        const scope = `view_${type.name}`;
        // ⭐关闭旧Scope（自动释放）
        if (this.currentScope) {
            ResManager.closeScope(this.currentScope);
        }

        this.currentScope = scope;
        const layer = UIManager.layer(UILayer.CONTENT);
        const node = await ResManager.openUI(scope, res.bundle, res.path, layer);
        const view = node.getComponent(type);
        view.setScope(scope);
        callback?.(view);
        return view;
    }

    /*================ Dialog =================*/

    async openDialog<T extends UIDialog>(type: Constructor<T>, callback?: (view: T) => T | void) {
        const res = UIResourceRegistry.get(type);
        const scope = `dialog_${Date.now()}`;
        const layer = UIManager.layer(UILayer.DIALOG);
        const mask = UIManager.createMask(layer);
        const node = await ResManager.openUI(scope, res.bundle, res.path, layer);
        node.setSiblingIndex(999);

        const dialog = node.getComponent(type);
        dialog.setScope(scope);

        return new Promise(resolve => {
            dialog._bind(result => {
                mask.destroy();
                ResManager.closeScope(scope);
                resolve(result);
            });
        });
    }
}

export const SceneMgr = SceneManager.instance;