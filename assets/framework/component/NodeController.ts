import {
    _decorator,
    Component,
    Node,
    Vec3,
    Quat,
    Enum,
    UITransform,
    Sprite,
    Label,
    Button,
    Widget,
    Layout,
    UIOpacity,
} from "cc";

const { ccclass, property, executeInEditMode } = _decorator;

interface Vec3Data {
    x: number;
    y: number;
    z: number;
}

interface QuatData {
    x: number;
    y: number;
    z: number;
    w: number;
}

interface ComponentState {
    [key: string]: any;
}

interface NodeRecord {
    path: string;
    active: boolean;
    position: Vec3Data;
    rotation: QuatData;
    scale: Vec3Data;
    components: ComponentState;
}

type NodeState = Record<string, NodeRecord>;

@ccclass("NodeController")
@executeInEditMode
export class NodeController extends Component {

    private states: Record<number, NodeState> = {};
    private stateIndex = 0;

    @property({ displayName: "StateID", type: Enum({ "0": 0, "1": 1, "2": 2, "3": 3, "4": 4, "5": 5 }) })
    get StateIndex() {
        return this.stateIndex;
    }

    set StateIndex(v: number) {
        if (this.stateIndex !== v) {
            this.stateIndex = v;
            this.recordIndex = this.stateIndex;
            this.applyState(v);
        }
    }

    @property({ displayName: "保存状态" })
    saveState = false;

    @property({ displayName: "删除状态" })
    deleteState = false;

    @property({ displayName: "UI配置JSON" })
    config = "{}";

    @property({ visible: false })
    recordIndex: number = 0;

    onLoad() {
        try {
            this.states = JSON.parse(this.config);
            this.StateIndex = this.recordIndex;
        } catch {
            this.states = {};
        }
    }

    update() {
        if (this.saveState) {
            this.captureState(this.stateIndex);
            this.saveState = false;
        }

        if (this.deleteState) {
            delete this.states[this.stateIndex];
            this.syncConfig();
            this.deleteState = false;
        }
    }

    protected onDestroy(): void {
        this.recordIndex = this.stateIndex;
    }

    /* 捕获状态 */

    captureState(id: number) {
        const state: NodeState = {};
        this.traverse(this.node, (n) => {
            const record: NodeRecord = {
                path: this.getNodePath(n),
                active: n.active,
                position: this.v3(n.getPosition()),
                rotation: this.q4(n.getRotation()),
                scale: this.v3(n.getScale()),
                components: this.captureComponents(n)
            };
            state[record.path] = record;
        });
        this.states[id] = state;
        this.syncConfig();
    }

    /* 应用状态 */
    applyState(id: number) {
        const state = this.states[id];
        if (!state) {
            return;
        }
        for (const path in state) {
            const node = this.findNode(path);
            if (!node) {
                continue;
            }
            const data = state[path];
            node.setPosition(new Vec3(data.position.x, data.position.y, data.position.z));
            node.setRotation(new Quat(data.rotation.x, data.rotation.y, data.rotation.z, data.rotation.w));
            node.setScale(new Vec3(data.scale.x, data.scale.y, data.scale.z));
            this.applyComponents(node, data.components);
            node.active = data.active;
        }
    }

    /* 组件捕获 */
    captureComponents(node: Node) {
        const data: ComponentState = {};
        const ui = node.getComponent(UITransform);
        if (ui) {
            data.UITransform = {
                width: ui.width,
                height: ui.height,
                anchorX: ui.anchorX,
                anchorY: ui.anchorY
            };
        }

        const sprite = node.getComponent(Sprite);
        if (sprite) {
            data.Sprite = {
                color: {
                    r: sprite.color.r,
                    g: sprite.color.g,
                    b: sprite.color.b,
                    a: sprite.color.a
                },
                sizeMode: sprite.sizeMode
            };
        }

        const label = node.getComponent(Label);
        if (label) {
            data.Label = {
                string: label.string,
                fontSize: label.fontSize,
                lineHeight: label.lineHeight,
                horizontalAlign: label.horizontalAlign,
                verticalAlign: label.verticalAlign
            };
        }

        const button = node.getComponent(Button);
        if (button) {
            data.Button = {
                interactable: button.interactable,
                transition: button.transition
            };
        }

        const widget = node.getComponent(Widget);
        if (widget) {
            data.Widget = {
                left: widget.left,
                right: widget.right,
                top: widget.top,
                bottom: widget.bottom,
                alignMode: widget.alignMode
            };
        }

        const layout = node.getComponent(Layout);
        if (layout) {
            data.Layout = {
                type: layout.type,
                resizeMode: layout.resizeMode,
                alignHorizontal: layout.alignHorizontal,
                alignVertical: layout.alignVertical,
                spacingX: layout.spacingX,
                spacingY: layout.spacingY
            };
        }

        const opacity = node.getComponent(UIOpacity);
        if (opacity) {
            data.UIOpacity = {
                opacity: opacity.opacity
            };
        }

        return data;
    }

    /* 应用组件 */
    applyComponents(node: Node, data: ComponentState) {
        const ui = node.getComponent(UITransform);
        if (ui && data.UITransform) {
            ui.width = data.UITransform.width;
            ui.height = data.UITransform.height;
            ui.anchorX = data.UITransform.anchorX;
            ui.anchorY = data.UITransform.anchorY;
        }

        const sprite = node.getComponent(Sprite);
        if (sprite && data.Sprite) {
            sprite.color.set(
                data.Sprite.color.r,
                data.Sprite.color.g,
                data.Sprite.color.b,
                data.Sprite.color.a
            );
            sprite.sizeMode = data.Sprite.sizeMode;
        }

        const label = node.getComponent(Label);
        if (label && data.Label) {
            label.string = data.Label.string;
            label.fontSize = data.Label.fontSize;
            label.lineHeight = data.Label.lineHeight;
            label.horizontalAlign = label.horizontalAlign,
                label.verticalAlign = label.verticalAlign
        }

        const button = node.getComponent(Button);
        if (button && data.Button) {
            button.interactable = data.Button.interactable;
            button.transition = data.Button.transition
        }

        const widget = node.getComponent(Widget);
        if (widget && data.Widget) {
            widget.left = data.Widget.left;
            widget.right = data.Widget.right;
            widget.top = data.Widget.top;
            widget.bottom = data.Widget.bottom;
            widget.alignMode = data.Widget.alignMode;
            widget.updateAlignment();
        }

        const layout = node.getComponent(Layout);
        if (layout && data.Layout) {
            layout.type = data.Layout.type;
            layout.spacingX = data.Layout.spacingX;
            layout.spacingY = data.Layout.spacingY;
            layout.resizeMode = layout.resizeMode,
                layout.alignHorizontal = layout.alignHorizontal,
                layout.alignVertical = layout.alignVertical,
                layout.updateLayout();
        }

        const opacity = node.getComponent(UIOpacity);
        if (opacity && data.UIOpacity) {
            opacity.opacity = data.UIOpacity.opacity;
        }
    }

    /* NodePath */

    getNodePath(node: Node) {
        let path = node.name;
        let parent = node.parent;
        while (parent && parent !== this.node) {
            path = parent.name + "/" + path;
            parent = parent.parent;
        }
        return path;
    }


    findNode(path: string) {
        const names = path.split("/");
        let cur: Node | null = this.node;
        if (names[0] === this.node.name) {
            names.shift();
        }
        for (const n of names) {
            cur = cur.getChildByName(n);
            if (!cur) return null;
        }
        return cur;
    }

    traverse(node: Node, cb: (node: Node) => void) {
        cb(node);
        for (const child of node.children) {
            this.traverse(child, cb);
        }
    }

    syncConfig() {
        this.config = JSON.stringify(this.states, null, 2);
    }

    v3(v: Vec3) {
        return { x: v.x, y: v.y, z: v.z };
    }

    q4(q: Quat) {
        return { x: q.x, y: q.y, z: q.z, w: q.w };
    }
}