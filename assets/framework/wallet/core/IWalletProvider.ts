export interface IWalletProvider {

    connect(): Promise<string>;

    getAddress(): Promise<string>;

    signMessage(message: string): Promise<string>;

    sendTransaction(tx: any): Promise<any>;

    restoreSession?(): Promise<any>;
}