import { _decorator, Component, Node } from 'cc';
import core, { DlgResource } from 'db://assets/framework/scripts/GameCore';
const { ccclass, property } = _decorator;

@ccclass('GameView')
@DlgResource("prefab/game/gameView", "game_baccarat")
export class GameView extends core.UIView {
    start() {

    }

    update(deltaTime: number) {
        
    }
}


