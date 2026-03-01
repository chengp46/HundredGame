import { _decorator, Component, Node } from 'cc';
import core, { DlgResource } from 'db://assets/framework/scripts/GameCore';
import { GameView } from '../game/GameView';
const { ccclass, property } = _decorator;

@ccclass('HallView')
@DlgResource("prefab/hall/hallView", "game_baccarat")
export class HallView extends core.UIView {
    start() {

    }

    update(deltaTime: number) {

    }

    onButtonClick(event: Event, customData: string) {
        switch (customData) {
            case 'enterGame':
                core.scene.changeView(GameView);
                break
            default:
                break;
        }
    }
}


