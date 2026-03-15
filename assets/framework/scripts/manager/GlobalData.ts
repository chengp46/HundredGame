
export class UserInfo {
    account: string;
    bonus_credits: number;
    real_money: number;
}

export class GlobalData {
    private static _instance: GlobalData;
    public static get instance() {
        if (!this._instance) {
            this._instance = new GlobalData();
        }
        return this._instance;
    }

    // 用户信息
    public userInfo: UserInfo = new UserInfo;
    // 玩法类型
    public playType: number = 0;
    // 游戏类型
    public gameType: number = 0;
}