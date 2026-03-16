import { _decorator, Component, Node, Sprite, SpriteFrame } from 'cc';
import core from 'db://assets/framework/GameCore';
const { ccclass, property } = _decorator;

@ccclass('Poker')
export class Poker extends Component {

    @property({ type: Sprite, displayName: "牌" })
    poker: Sprite = null;

    pokerSuit: number = 0; // 花色
    pokerPoint: number = 0; // 点数

    start() {

    }

    async setPoker(suit: number, point: number) {
        this.pokerSuit = suit;
        this.pokerPoint = point;
        if (suit == 0 || point == 0) {
            this.poker.spriteFrame = await core.loader.load("texture/game/poker/card_back/spriteFrame", SpriteFrame, "game_baccarat");
        } else {
            let pokerpoint = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
            let card = `${pokerpoint[point - 1]}${suit}`
            this.poker.spriteFrame = await core.loader.load(`texture/game/poker/${card}/spriteFrame`, SpriteFrame, "game_baccarat");
        }
    }
}


