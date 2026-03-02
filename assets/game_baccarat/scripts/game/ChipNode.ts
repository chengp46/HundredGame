import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ChipNode')
export class ChipNode extends Component {

    @property({ type: [SpriteFrame], displayName: "筹码精灵" })
    chipArr: SpriteFrame[] = [];

    @property(Sprite)
    chip: Sprite = null;

    start() {

    }

    setChip(index: number) {
        if (index < 0 || index > 4) {
            return;
        }
        this.chip.spriteFrame = this.chipArr[index];
    }

}


