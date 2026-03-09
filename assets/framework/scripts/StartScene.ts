import { _decorator, Component, Node, Prefab, profiler } from 'cc';
import core from './GameCore';
import { ResLoader } from './manager/ResLoader';
const { ccclass, property } = _decorator;

@ccclass('StartScene')
export class StartScene extends Component {

    async start() {
        core.message.on("login_resp", this.loginResp, this);
        core.scene.initScene(this.node);
        core.audio.init(this.node);
        await core.config.loadAllConfigs();
        await core.language.initConfig();
        core.wssock.Url = "ws:192.168.100.62:6006/ws";
        core.wssock.connect();
        this.loadHall();
        profiler.hideStats(); // 隐藏
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

    async loadHall() {
        let bundle = await ResLoader.getBundle("game_baccarat");
        if (!bundle) {
            return;
        }
        bundle.load("prefab/hall/hallView", Prefab, (err, asset)=>{
            if (err) {
                return;
            }
            core.scene.loadView(asset);
        });
    }

}


