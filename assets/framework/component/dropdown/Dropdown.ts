import { _decorator, Component, Node, Label, ScrollView, Prefab, UITransform, Button, tween, Vec3 } from 'cc';

import { DropdownData } from './DropdownData';
import { DropdownItem } from './DropdownItem';
import { DropdownStyle } from './DropdownStyle';
import { DropdownPool } from './DropdownPool';

const { ccclass, property } = _decorator;

@ccclass('Dropdown')
export class Dropdown extends Component {

    @property(Label)
    currentLabel: Label = null!;

    @property(Node)
    listRoot: Node = null!;

    @property(ScrollView)
    scrollView: ScrollView = null!;

    @property(Prefab)
    itemPrefab: Prefab = null!;

    /** 样式 */
    private style = new DropdownStyle();

    /** 数据 */
    private data: DropdownData[] = [];

    /** Item */
    private items: Node[] = [];

    /** 当前选中 */
    private selectedIndex = -1;

    /** content */
    private content!: Node;

    /** 对象池 */
    private pool!: DropdownPool;

    /** 是否展开 */
    private opened = false;

    /** 回调 */
    public onChanged: ((index: number, data: DropdownData) => void) | null = null;

    onLoad() {
        this.content = this.scrollView.content!;
        this.pool = new DropdownPool(this.itemPrefab);
        this.listRoot.active = false;
        this.listRoot.scale = new Vec3(1, 0, 1);
    }

    /**
     * 设置数据
     */
    public setData(data: DropdownData[]) {
        this.data = data;
        this.buildItems();
        if (data.length > 0) {
            this.select(0);
        }
    }

    /**
     * 创建列表
     */
    private buildItems() {
        this.clearItems();
        const visibleCount = Math.min(this.data.length, this.style.maxVisibleCount);
        const contentUI = this.content.getComponent(UITransform)!;
        contentUI.height = this.data.length * this.style.itemHeight;

        for (let i = 0; i < this.data.length; i++) {
            const node = this.pool.get();
            node.active = true;
            this.content.addChild(node);
            const ui = node.getComponent(UITransform)!;
            ui.height = this.style.itemHeight;
            node.setPosition(0, -i * this.style.itemHeight - this.style.itemHeight / 2);
            const item = node.getComponent(DropdownItem)!;
            item.setData(i, this.data[i], i === this.selectedIndex, this.select.bind(this));
            this.items.push(node);
        }

        // View高度
        const viewUI = this.scrollView.node.getComponent(UITransform)!;
        viewUI.height = visibleCount * this.style.itemHeight;
    }

    /**
     * 清理
     */
    private clearItems() {
        for (const item of this.items) {
            this.pool.put(item);
        }
        this.items.length = 0;
    }

    /**
     * 选择
     */
    private select(index: number) {
        this.selectedIndex = index;
        const data = this.data[index];
        this.currentLabel.string = data.text;
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i].getComponent(DropdownItem)!;
            item.setData(i, this.data[i], i === index, this.select.bind(this));
        }
        this.onChanged?.(index, data);
        this.hide();
    }

    /**
     * Toggle
     */
    public toggle() {
        if (this.opened) {
            this.hide();
        } else {
            this.show();
        }
    }

    /**
     * 展开
     */
    public show() {
        if (this.opened) {
            return;
        }
        this.opened = true;
        this.listRoot.active = true;
        tween(this.listRoot)
            .stop()
            .to(this.style.animTime, { scale: new Vec3(1, 1, 1) })
            .start();
    }

    /**
     * 隐藏
     */
    public hide() {
        if (!this.opened) {
            return;
        }
        this.opened = false;
        tween(this.listRoot)
            .stop()
            .to(this.style.animTime, { scale: new Vec3(1, 0, 1) })
            .call(() => {
                this.listRoot.active = false;
            }).start();
    }

    /**
     * 当前数据
     */
    public getSelectedData() {
        if (this.selectedIndex < 0) {
            return null;
        }
        return this.data[this.selectedIndex];
    }

    /**
     * 当前索引
     */
    public getSelectedIndex() {
        return this.selectedIndex;
    }

    onDestroy() {
        this.clearItems();
        this.pool.clear();
    }
}