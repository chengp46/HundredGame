import { _decorator, Component, Node } from 'cc';
import core from './GameCore';
import { HallView } from '../../game_baccarat/scripts/hall/HallView';
const { ccclass, property } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {

    async start() {
        core.scene.initScene(this.node);
        core.audio.init();
        await core.config.loadAllConfigs();
        await core.language.initConfig();
        core.wssock.Url = "ws:192.168.100.62:6006/ws";
        core.wssock.connect();
        core.scene.changeView(HallView);
    }

}


