import { _decorator, Component } from "cc";
import { ScreenEvent } from "./UIManager";
import { MessageMgr } from "../manager/MessageManager";

const { ccclass } = _decorator;

@ccclass("UIView")
export class UIView extends Component {

    scope!: string;

    protected onLoad() {
        MessageMgr.on(ScreenEvent.EventShowAndHide, this.onEventShow, this);
    }

    protected onDestroy() {
        MessageMgr.offAll(this);
    }

    setScope(scope: string) {
        this.scope = scope;
    }

    protected onEventShow(event: string, show: boolean) { }
}