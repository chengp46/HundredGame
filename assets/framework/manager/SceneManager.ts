import { _decorator, Component, macro, Node, UITransform, Prefab, error, instantiate, Button, v3, tween, Sprite, Color, isValid, size, Game, director, game, screen, view, Vec3, ResolutionPolicy, find, Canvas, Layers, Camera, gfx, renderer, Widget, SpriteFrame, UIOpacity, Size, sys, math, Tween } from 'cc';
import { MessageMgr } from './MessageManager';
import { __TYPE__, UIResource } from './Decorators';
import { ResLoader } from './ResLoader';
import { ImageUtil } from '../utils/ImageUtil';
import { LayerUtil } from '../utils/LayerUtil';
import { LayoutUtil } from '../utils/LayoutUtil';
const { ccclass, property } = _decorator;

export enum ScreenEvent {
    WindowSize = '__WindowSize',
    OrientationChange = '__OrientationChange',
    FullScreenChange = '__FullScreenChange',
    EventShowAndHide = '__EventShowAndHide',
}

export enum ScreenOrientation {
    ORIENTATION_LANDSCAPE = 0,
    ORIENTATION_PORTRAIT,
}

export class UIView extends Component {
    protected onLoad(): void {
        MessageMgr.on(ScreenEvent.EventShowAndHide, (event, bShow: boolean) => {
            this.onEventShow(bShow);
        }, this);
    }

    protected onDestroy(): void {
        MessageMgr.offAll(this);
    }

    onEventShow(bShow: boolean) {
    }

    show() {
        this.node.active = true;
    }

    close() {

    }
}

export class UIDialog extends Component {
    @property({ type: Node, displayName: '背景框' })
    background: Node | null = null;

    @property({ type: Button, displayName: '关闭按钮' })
    closeBtn: Button = null;

    // 对话框的初始缩放比例
    protected initialScale: Vec3 = new Vec3(0, 0, 1);

    protected onLoad(): void {
        this.background?.on(Node.EventType.TOUCH_START, this.onDialogClick, this);
        this.closeBtn?.node.on(Button.EventType.CLICK, this.onClose, this);
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
        MessageMgr.offAll(this);
    }

    showDialog() {
        SceneMgr.MaskClick = true;
        SceneMgr.showMask(true, () => {
            if (SceneMgr.MaskClick) {
                this.hideDialog();
            }
        });
        this.node.active = true;
        if (this.background) {
            this.background.scale = this.initialScale;
            this.background.active = true;
            tween(this.background).to(0.2, { scale: v3(1, 1, 1) }, { easing: "backOut" }).start();
        }
    }

    hideDialog() {
        SceneMgr.showMask(false);
        if (this.background) {
            this.background.active = true;
            tween(this.node).to(0.2, { scale: this.initialScale }, { easing: "backIn" })
                .call(() => {
                    this.node.destroy();
                }).start();
        }
    }

    onMaskClick(event) {
        this.hideDialog();
    }

    onDialogClick(event) {
        event.propagationStopped = true
    }

    onClose() {
        this.hideDialog();
    }
}

export class SceneManager {
    static instance: SceneManager = new SceneManager();
    protected sceneNode!: Node;
    protected backgroundLayer!: Node;
    protected sceneLayer!: Node;
    protected popupLayer!: Node;
    protected topLayer!: Node;
    protected currentView: UIView = null;
    protected resourceMap: Map<string, UIResource> = new Map;
    protected prefabResource: Map<string, Prefab> = new Map;
    protected bGlobalEvent = false;
    // 游戏运行速度
    protected playSpeed = 1;
    protected cacheTick = director.tick;
    // 对话框遮罩是否响应
    protected bMaskClick = false;

    protected constructor() {
    }

    get SceneNode() {
        return this.sceneNode;
    }

    get ResourceMap() {
        return this.resourceMap;
    }

    get PrefabResource() {
        return this.prefabResource;
    }

    get Scene() {
        return this.sceneLayer;
    }

    get Dialog() {
        return this.popupLayer;
    }

    set MaskClick(val: boolean) {
        this.bMaskClick = val;
    }

    get MaskClick() {
        return this.bMaskClick;
    }

    // 设置游戏速度
    set PlaySpeed(value: number) {
        this.playSpeed = value;
    }

    get PlaySpeed() {
        return this.playSpeed;
    }

    initScene(sceneNode: Node) {
        this.sceneNode = sceneNode;
        const canvasSize = view.getVisibleSize();
        // 背景层
        this.backgroundLayer = new Node("BackgroundLayer");
        this.backgroundLayer.parent = this.sceneNode;
        this.backgroundLayer.addComponent(UITransform).contentSize = canvasSize;
        LayoutUtil.AlignVerticalHorizontalFull(this.backgroundLayer);
        // 场景层
        this.sceneLayer = new Node("SceneView");
        this.sceneLayer.parent = this.sceneNode;
        this.sceneLayer.addComponent(UITransform).contentSize = canvasSize;
        LayoutUtil.AlignVerticalHorizontalFull(this.sceneLayer);
        // 弹窗层
        this.popupLayer = new Node("PopupView");
        this.popupLayer.parent = this.sceneNode;
        this.popupLayer.addComponent(UITransform).contentSize = canvasSize;
        LayoutUtil.AlignVerticalHorizontalFull(this.popupLayer);
        const maskNode = new Node("maskNode");
        maskNode.parent = this.popupLayer;
        maskNode.addComponent(UIOpacity).opacity = 50;
        let mask = maskNode.addComponent(Sprite);
        mask.spriteFrame = ImageUtil.createPureColorSpriteFrame(Color.BLACK);
        mask.sizeMode = 0;
        maskNode.getComponent(UITransform).contentSize = canvasSize;
        const textureSize = mask.spriteFrame.originalSize;
        const scaleX = canvasSize.width / textureSize.width;
        const scaleY = canvasSize.height / textureSize.height;
        const scale = Math.max(scaleX, scaleY); // 按较大比例等比缩放，保证铺满
        mask.node.setScale(scale, scale, 1);
        LayerUtil.setNodeLayer(LayerUtil.UI_2D, this.popupLayer);
        maskNode.active = false;
        // 最顶层
        this.topLayer = new Node("TopView");
        this.topLayer.parent = this.sceneNode;
        this.topLayer.addComponent(UITransform).contentSize = canvasSize;
        LayoutUtil.AlignVerticalHorizontalFull(this.topLayer);
        LayerUtil.setNodeLayer(LayerUtil.UI_2D, this.topLayer);

        // 设置设计分辨率
        const designSize = view.getDesignResolutionSize();
        view.resizeWithBrowserSize(true);
        console.log(`设计分辨率: ${designSize.width} x ${designSize.height}  ${window.innerWidth} x ${window.innerHeight}`);
        view.setDesignResolutionSize(designSize.width, designSize.height, ResolutionPolicy.FIXED_HEIGHT);
        if (!this.bGlobalEvent) {
            this.bGlobalEvent = true;
            // 进入后台时触发的事件
            game.on(Game.EVENT_HIDE, this.onEventHide, this);
            // 切换到前台事件
            game.on(Game.EVENT_SHOW, this.onEventShow, this);
            document.addEventListener("visibilitychange", () => {
                if (document.hidden) {
                    this.onEventHide();
                } else {
                    this.onEventShow();
                }
            });
        }

        screen.on('window-resize', this.onWindowResize, this);
        window.addEventListener("resize", this.onWindowResize.bind(this));
        screen.on('orientation-change', this.onOrientationChange, this);

        director.tick = (dt: number) => {
            this.cacheTick.call(director, dt * this.playSpeed);
        };
        //this.onWindowResize(designSize.width, designSize.height);
        const ww = window.innerWidth;
        const wh = window.innerHeight;
        const scales = Math.min(ww / canvasSize.width, wh / canvasSize.height);
        const cWw = canvasSize.width * scales;
        const cWh = canvasSize.height * scales;
        let scaleYY = window.innerHeight / cWh;
        screen.windowSize = new Size(cWw * scaleYY, cWh * scaleYY);
    }

    onEventHide() {
        // 暂停所有 Tween
        Tween.stopAll();
        // 暂停 scheduler（update / schedule）
        director.pause();
        // 暂停全局时间
        //director.getScheduler().setTimeScale(0);
        // 暂停所有 Animation
        const nodes = director.getScene().children;
        this.pauseAnimation(nodes);
        MessageMgr.dispatchEvent(ScreenEvent.EventShowAndHide, false);
    }

    onEventShow() {
        // 恢复 scheduler
        director.resume();
        // 恢复时间
        //director.getScheduler().setTimeScale(1);
        // 恢复 Animation
        const nodes = director.getScene().children;
        this.resumeAnimation(nodes);
        MessageMgr.dispatchEvent(ScreenEvent.EventShowAndHide, true);
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


    // 是否横屏（Web 平台用窗口宽高判断）
    isLandscape(): boolean {
        return window.innerWidth > window.innerHeight;
    }

    curSize: Size = new Size();
    onWindowResize(width: number, height: number) {
        // const canvasSize = view.getVisibleSize();
        // console.log("onWindowResize...............", this.curSize, screen.windowSize);
        // const ww = window.innerWidth;
        // const wh = window.innerHeight;
        // const scales = Math.min(ww / canvasSize.width, wh / canvasSize.height);
        // let cWidth = canvasSize.width * scales;
        // let cHeight = canvasSize.height * scales;
        // if (this.curSize.width == cWidth && this.curSize.height == cHeight) {
        //     return;
        // }
        // this.curSize.width = cWidth;
        // this.curSize.height = cHeight;
        // screen.windowSize = new Size(cWidth, cHeight);
    }

    onOrientationChange(orientation: number) {
        if (orientation === macro.ORIENTATION_LANDSCAPE_LEFT || orientation === macro.ORIENTATION_LANDSCAPE_RIGHT) {
            console.log("Orientation changed to landscape:", orientation);
            MessageMgr.dispatchEvent(ScreenEvent.OrientationChange, ScreenOrientation.ORIENTATION_LANDSCAPE);
        } else {
            console.log("Orientation changed to portrait:", orientation);
            MessageMgr.dispatchEvent(ScreenEvent.OrientationChange, ScreenOrientation.ORIENTATION_PORTRAIT);
        }
    }

    async loadView(prefabPath: string, bundleName: string) {
        let bundle = await ResLoader.getBundle(bundleName);
        if (!bundle) {
            return;
        }
        bundle.load("prefab/hall/hallView", Prefab, (err, asset) => {
            if (err) {
                return;
            }
            const newNode = instantiate(asset);
            newNode.parent = this.sceneLayer;
        });
    }

    changeView<T extends UIView>(viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        let resource = this.resourceMap.get(viewType.name);
        if (!resource) {
            error(`${viewType.name} 没有配置预制体资源....`);
            return;
        }
        let prefabRes = this.PrefabResource.get(resource.resPath);
        if (!prefabRes) {
            let func = async () => {
                let prefab = await ResLoader.load(resource.resPath, Prefab, resource.bundle);
                this.prefabResource.set(viewType.name, prefab);
                this.showView(prefab, viewType, callback);
            };
            func();
        } else {
            this.showView(prefabRes, viewType, callback);
        }
    }

    protected showView<T extends UIView>(prefab: Prefab, viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        const newNode = instantiate(prefab);
        newNode.parent = this.sceneLayer;
        newNode.active = false;
        let view = newNode.getComponent(viewType);
        view.show();
        if (callback) {
            callback(view);
        }
        if (this.currentView) {
            this.currentView.close();
            if (isValid(this.currentView.node)) {
                this.currentView.node.destroy();
            }
        }
        this.currentView = view;
    }

    openDialog<T extends UIDialog>(dialogType: __TYPE__<T>, callback?: (dialog: T) => T | void) {
        let resource = this.resourceMap.get(dialogType.name);
        if (!resource) {
            error(`${dialogType.name} 没有配置预制体资源....`);
            return;
        }
        let prefabRes = this.PrefabResource.get(dialogType.name);
        if (!prefabRes) {
            let func = async () => {
                let prefab = await ResLoader.load(resource.resPath, Prefab, resource.bundle);
                this.prefabResource.set(dialogType.name, prefab);
                this.showDialog(prefab, dialogType, callback);
            };
            func();
        } else {
            this.showDialog(prefabRes, dialogType, callback);
        }
    }

    protected showDialog<T extends UIDialog>(prefab: Prefab, viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        const newNode = instantiate(prefab);
        newNode.parent = this.popupLayer;
        newNode.active = false;
        let view = newNode.getComponent(viewType);
        view.showDialog();
        if (callback) {
            callback(view);
        }
    }

    closeAllDialog() {
        this.popupLayer?.removeAllChildren();
    }

    addTopView<T extends UIView>(viewType: __TYPE__<T>, callback?: (view: T) => T | void) {
        let resource = this.resourceMap.get(viewType.name);
        if (!resource) {
            error(`${viewType.name} 没有配置预制体资源....`);
            return;
        }
        let prefabRes = this.PrefabResource.get(resource.resPath);
        if (!prefabRes) {

        }
    }

    closeAllTopView() {
        this.topLayer?.removeAllChildren();
    }

    setSpriteFrame(url: string, sprite: Sprite, bundle: string = "resources") {
        let callback = async () => {
            let spriteFrame = await ResLoader.load(url, SpriteFrame, bundle);
            sprite.spriteFrame = spriteFrame;
        };
        callback();
    }

    showMask(show: boolean, callback?: () => void) {
        let mask = this.popupLayer.getChildByName("maskNode");
        if (null == mask) {
            return;
        }
        if (show) {
            mask.active = true;
            if (this.bMaskClick && callback) {
                mask.once(Node.EventType.TOUCH_START, callback);
            }
        } else {
            mask.active = false;
        }
    }
}

export const SceneMgr = SceneManager.instance;
