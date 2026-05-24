import { _decorator, Component, Node, Prefab, instantiate, NodePool, UITransform, Vec3, } from 'cc';
import { RoadLayout, RoadPos } from './RoadLayout';

const { ccclass, property } = _decorator;

@ccclass('RoadView')
export class RoadView extends Component {

    @property(Node)
    content: Node = null!;

    @property(Prefab)
    cellPrefab: Prefab = null!;

    @property
    cellSize = 32;

    @property
    maxRow = 6;

    private layout = new RoadLayout();

    private pool = new NodePool();

    private active = new Map<string, Node>();

    private positions: RoadPos[] = [];

    private viewColStart = 0;
    private viewColEnd = 0;

    // =====================
    // 渲染入口
    // =====================

    render(road: any[][]) {
        this.positions = this.layout.build(road);
        this.updateContentSize(road.length);
        this.updateVisibleRange();
        this.refreshVisible();
    }

    // =====================
    // 可见区域计算（赌场核心）
    // =====================

    private updateVisibleRange() {
        const viewWidth = this.node.getComponent(UITransform)!.width;
        const contentWidth = this.content.getComponent(UITransform)!.width;
        const offsetX = -this.content.position.x;

        this.viewColStart = Math.floor(offsetX / this.cellSize) - 1;

        this.viewColEnd = Math.ceil((offsetX + viewWidth) / this.cellSize) + 1;

        this.viewColStart = Math.max(0, this.viewColStart);
        this.viewColEnd = Math.max(0, this.viewColEnd);
    }

    // =====================
    // 只刷新可见格子 ⭐⭐⭐⭐⭐
    // =====================

    private refreshVisible() {
        const nextActive = new Map<string, Node>();
        for (const pos of this.positions) {
            if (pos.col < this.viewColStart || pos.col > this.viewColEnd)
                continue;

            const key = `${pos.col}_${pos.row}`;
            let node = this.active.get(key);

            if (!node) {
                node = this.createCell(pos);
            }

            nextActive.set(key, node);
        }

        // 回收不可见节点
        this.active.forEach((node, key) => {
            if (!nextActive.has(key)) {
                node.removeFromParent();
                this.pool.put(node);
            }
        });

        this.active = nextActive;
    }

    // =====================
    // 创建格子
    // =====================

    private createCell(pos: RoadPos): Node {
        const node = this.pool.size() > 0 ? this.pool.get()! : instantiate(this.cellPrefab);
        node.setParent(this.content);
        node.setPosition(new Vec3(pos.col * this.cellSize, -pos.row * this.cellSize));
        const view = node.getComponent('RoadCellView') as any;
        view?.setData(pos.data);
        return node;
    }

    // =====================
    // Content尺寸
    // =====================

    private updateContentSize(colCount: number) {
        const trans = this.content.getComponent(UITransform)!;
        trans.setContentSize(colCount * this.cellSize, this.maxRow * this.cellSize);
    }

    // =====================
    // 自动滚到最右（赌场行为）
    // =====================

    autoScrollRight() {
        const parentWidth = this.node.getComponent(UITransform)!.width;
        const contentWidth = this.content.getComponent(UITransform)!.width;
        const offset = Math.max(0, contentWidth - parentWidth);
        this.content.setPosition(new Vec3(-offset, this.content.position.y));
        this.updateVisibleRange();
        this.refreshVisible();
    }

    // =====================
    // 外部滚动调用
    // =====================

    onScroll() {
        this.updateVisibleRange();
        this.refreshVisible();
    }

    clear() {

        this.active.forEach(node => {
            node.removeFromParent();
            this.pool.put(node);
        });

        this.active.clear();
    }
}