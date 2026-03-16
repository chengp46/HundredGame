import core from "db://assets/framework/GameCore";

export class Request {
    private static _instance: Request;
    public static get instance() {
        if (!this._instance) {
            this._instance = new Request();
        }
        return this._instance;
    }

    sendEnterRoom(playe_type: number, game_type: number) {
        core.wssock.send(JSON.stringify({ msg_id: "enter_room_req", play_type: playe_type, game_type: game_type }));
    }

    sendBettingReq(mode: number, amount: number, areaId: number) {
        core.wssock.send(JSON.stringify({ msg_id: "betting_req", mode: mode, amount: amount, zone: areaId }));
    }

    leaveRoomReq() {
        core.wssock.send(JSON.stringify({ msg_id: "leave_room_req"}));
    }

    roadsReq() {
         core.wssock.send(JSON.stringify({ msg_id: "roads_req"}));
    }
    
}

export const protoReq = Request.instance;