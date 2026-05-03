export enum WalletState {
    IDLE,
    DETECTING,
    CONNECTING,
    CONNECTED,
    SIGNING,
    DISCONNECTED
}

export interface IWalletProvider {

    connect(): Promise<string>;

    getAddress(): Promise<string>;

    sendTransaction(tx: any): Promise<any>;

    signMessage?(msg: string): Promise<string>;

    disconnect?(): void;
}