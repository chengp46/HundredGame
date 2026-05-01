import {
    _decorator, Component, Node, UITransform, view, Sprite,
    Color, tween, Vec3, Event
} from "cc";

const { ccclass } = _decorator;

/*================ Layer =================*/

export enum UILayer {
    BACKGROUND,
    CONTENT,
    DIALOG,
    TOP
}

/*================ Event =================*/

export enum ScreenEvent {
    WindowSize = "__WindowSize",
    OrientationChange = "__OrientationChange",
    EventShowAndHide = "__EventShowAndHide",
}

/*=============================
    UIResource
=============================*/
export class UIResource {
    constructor(
        public bundle: string,
        public path: string,
        public layer = UILayer.DIALOG,
        public cache = false,
        public singleton = false
    ) { }
}

export type Constructor<T = any> = { new(...args: any[]): T; };

export class UIResourceRegistry {
    private static map = new Map<Constructor<any>, UIResource>();

    static register<T>(type: Constructor<T>, res: UIResource) {
        this.map.set(type, res);
    }

    static get<T>(type: Constructor<T>) {
        return this.map.get(type);
    }
}

export function DialogResource(opt: { bundle: string, path: string, cache?: boolean, singleton?: boolean, layer?: UILayer }) {
    return function <T extends Constructor<any>>(target: T) {
        UIResourceRegistry.register(target,
            new UIResource(
                opt.bundle,
                opt.path,
                opt.layer ?? UILayer.DIALOG,
                opt.cache ?? false,
                opt.singleton ?? false
            )
        );
    };
}

/*=============================
    Weak UI Cache
=============================*/
type Weak<T> = {
    deref(): T | undefined;
};

class FakeWeakRef<T> implements Weak<T> {

    constructor(private value: T) { }

    deref() {
        return this.value;
    }
}

export function createWeakRef<T>(obj: T): Weak<T> {
    return new FakeWeakRef(obj);
}

export class UICache {

    private static cache = new Map<Constructor, Weak<Node>>();

    static get(type: Constructor) {
        return this.cache.get(type)?.deref();
    }

    static set(type: Constructor, node: Node) {
        this.cache.set(type, createWeakRef(node));
    }

    static remove(type: Constructor) {
        this.cache.delete(type);
    }
}

/*=============================
    BlockMask
=============================*/
@ccclass("BlockMask")
export class BlockMask extends Component {

    onEnable() {
        const n = this.node;
        [
            Node.EventType.TOUCH_START,
            Node.EventType.TOUCH_MOVE,
            Node.EventType.TOUCH_END,
            Node.EventType.TOUCH_CANCEL,
            Node.EventType.MOUSE_DOWN,
            Node.EventType.MOUSE_WHEEL
        ].forEach(e => n.on(e, this.stop, this));
    }

    onDisable() {
        const n = this.node;
        [
            Node.EventType.TOUCH_START,
            Node.EventType.TOUCH_MOVE,
            Node.EventType.TOUCH_END,
            Node.EventType.TOUCH_CANCEL,
            Node.EventType.MOUSE_DOWN,
            Node.EventType.MOUSE_WHEEL
        ].forEach(e => n.off(e, this.stop, this));
    }

    private stop(e: Event) {
        e.propagationStopped = true;
    }
}

/*=============================
    UIManager
=============================*/

export class UIManager {

    private static layers = new Map<UILayer, Node>();

    static init(root: Node) {
        const size = view.getVisibleSize();
        Object.values(UILayer)
            .filter(v => typeof v === "number")
            .forEach(layer => {
                const node = new Node(UILayer[layer]);
                node.addComponent(UITransform)
                    .setContentSize(size);
                node.parent = root;
                this.layers.set(layer, node);
            });
    }

    static layer(layer: UILayer) {
        return this.layers.get(layer)!;
    }

    /*-------------Mask-------------*/
    static createMask(parent: Node) {
        const mask = new Node("Mask");
        const trans = mask.addComponent(UITransform);
        trans.setContentSize(10000, 10000);
        const sp = mask.addComponent(Sprite);
        sp.color = new Color(0, 0, 0, 120);
        mask.addComponent(BlockMask);
        parent.addChild(mask);
        return mask;
    }

    /*-------------Anim-------------*/
    static openAnimator(node: Node) {
        node.setScale(new Vec3(.8, .8));
        tween(node)
            .to(.25, { scale: Vec3.ONE })
            .start();
    }

    static closeAnimator(node: Node) {
        tween(node)
            .to(.2, { scale: new Vec3(.85, .85) })
            .start();
    }
}