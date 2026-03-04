import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import core from 'db://assets/framework/scripts/GameCore';
const { ccclass, property } = _decorator;

@ccclass('Poker')
export class Poker extends Component {

    @property({ type: Sprite, displayName: "牌" })
    poker: Sprite = null;

    start() {

    }

    async setPoker() {
        this.poker.spriteFrame = await core.loader.load("texture/game/poker/11/spriteFrame", SpriteFrame, "game_baccarat");
    }
}


