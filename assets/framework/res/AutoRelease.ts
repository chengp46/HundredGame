import { _decorator, Component } from "cc";
import { RefGraph } from "./RefGraph";

const { ccclass } = _decorator;

@ccclass("AutoRelease")
export class AutoRelease extends Component {

    private resUuid = "";

    init(uuid: string) {
        this.resUuid = uuid;
    }

    onDestroy() {
        if (!this.resUuid) return;
        RefGraph.release(this.resUuid);
        this.resUuid = "";
    }
}