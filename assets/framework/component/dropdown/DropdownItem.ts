import { _decorator, Component, Label, Sprite, Button } from 'cc';

import { DropdownData } from './DropdownData';

const { ccclass, property } = _decorator;

@ccclass('DropdownItem')
export class DropdownItem extends Component {

    @property(Label)
    label: Label = null!;

    @property(Sprite)
    selectBg: Sprite = null!;

    private index = -1;

    private clickCb: ((index: number) => void) | null = null;

    private data!: DropdownData;

    onLoad() {
        this.node.on(Button.EventType.CLICK, this.onClick, this);
    }

    /**
     * 设置数据
     */
    public setData(index: number, data: DropdownData, selected: boolean, clickCb: (index: number) => void) {
        this.index = index;
        this.data = data;
        this.clickCb = clickCb;
        this.label.string = data.text;
        this.selectBg.node.active = selected;
    }

    /**
     * 点击
     */
    private onClick() {
        this.clickCb?.(this.index);
    }

    /**
     * 获取数据
     */
    public getData() {
        return this.data;
    }
}