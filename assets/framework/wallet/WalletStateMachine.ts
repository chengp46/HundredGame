import { WalletState } from "./types";

export class WalletStateMachine {

    private state = WalletState.IDLE;

    setState(s: WalletState) {
        console.log("Wallet State =>", WalletState[s]);
        this.state = s;
    }

    getState() {
        return this.state;
    }

    isConnected() {
        return this.state === WalletState.CONNECTED;
    }
}