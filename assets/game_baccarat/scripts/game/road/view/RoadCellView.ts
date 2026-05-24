import { _decorator, Component, Sprite, Color } from 'cc';
import { BaccaratResult } from '../core/BaccaratDefine';


const { ccclass, property } = _decorator;

@ccclass('RoadCellView')
export class RoadCellView extends Component {

    @property(Sprite)
    icon: Sprite = null!;

    setData(data: any) {
        switch (data.result) {
            case BaccaratResult.Banker:
                this.icon.color = Color.RED;
                break;

            case BaccaratResult.Player:
                this.icon.color = Color.BLUE;
                break;

            default:
                this.icon.color = Color.GREEN;
        }
    }
}