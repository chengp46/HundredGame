import { _decorator, Component, Node } from 'cc';
import core from './GameCore';
import { HallView } from '../../game_baccarat/scripts/hall/HallView';
const { ccclass, property } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {

    async start() {
        core.message.on("login_resp", this.loginResp, this);
        core.scene.initScene(this.node);
        core.audio.init();
        await core.config.loadAllConfigs();
        await core.language.initConfig();
        core.wssock.Url = "ws:192.168.100.62:6006/ws";
        core.wssock.connect();
        core.scene.changeView(HallView);
    }

    protected onDestroy(): void {
        core.message.offAll(this);
    }

    loginResp(event: string | number, data) {
        core.data.userInfo.account = data.account;
        core.data.userInfo.bonus_credits = data.bonus_credits;
        core.data.userInfo.real_money = data.real_money;
        core.log.info(data);
    }

}


