import core from "./GameCore";

export class WsClient {
    private static _instance: WsClient;
    public static get instance() {
        if (!this._instance) {
            this._instance = new WsClient();
        }
        return this._instance;
    }

    protected url: string = "";
    protected ws: WebSocket | null = null;
    protected heartTimer = null;
    protected reconnectTimer = null;
    protected reconnectDelay = 3000;

    set Url(value: string) {
        this.url = value;
    }

    get Url() {
        return this.url;
    }

    connect() {
        if (this.ws) {
            return;
        }

        this.ws = new WebSocket(this.url);
        this.ws.onopen = () => {
            core.log.info("WS connected");
            this.startHeartBeat();
            this.ws.send(JSON.stringify({ msg_id: "login_req", option: 0 }));
        };

        this.ws.onmessage = (e) => {
            switch (e.data.msg_id) {
                case "login_resp":
                    console.log("login message:", e.data);
                    break;
                default:
                    console.log("WS message:", e.data);
            }
        };

        this.ws.onerror = () => {
            console.log("WS error");
        };

        this.ws.onclose = () => {
            console.log("WS closed");
            this.stopHeartBeat();
            this.ws = null;
            this.reconnect();
        };
    }

    // 发送数据
    send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
                typeof data === "string" ? data : JSON.stringify(data)
            );
        }
    }

    startHeartBeat() {
        this.heartTimer = setInterval(() => {
            this.send({ msg_id: "heartbeat_req", id: 100 });
        }, 5000);
    }

    stopHeartBeat() {
        clearInterval(this.heartTimer);
        this.heartTimer = null;
    }

    reconnect() {
        if (this.reconnectTimer) return;

        this.reconnectTimer = setTimeout(() => {
            console.log("WS reconnecting...");
            this.reconnectTimer = null;
            this.connect();
        }, this.reconnectDelay);
    }

    close() {
        this.stopHeartBeat();
        this.ws && this.ws.close();
        this.ws = null;
    }
}

export const WsSocket = WsClient.instance;
