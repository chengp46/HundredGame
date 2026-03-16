import { _decorator, AssetManager, assetManager, Component} from 'cc';
import core from './GameCore';
const { ccclass } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {

    async start() {
        core.message.on("login_resp", this.loginResp, this);
        core.scene.initScene(this.node);
        core.audio.init(this.node);
        await core.config.loadAllConfigs();
        core.language.initConfig();
        core.wssock.Url = "ws:192.168.100.62:6006/ws";
        core.wssock.connect();
        await core.scene.loadView("prefab/hall/hallView", "game_baccarat");
    }

    protected onDestroy(): void {
        core.message.offAll(this);
        core.audio.release();
    }

    loginResp(event: string | number, data) {
        core.data.userInfo.account = data.account;
        core.data.userInfo.bonus_credits = data.bonus_credits;
        core.data.userInfo.real_money = data.real_money;
        core.log.info(data);
    }
}


