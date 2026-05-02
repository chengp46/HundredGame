export interface IWallet {

    connect(): Promise<string>;

    sign(message: string): Promise<string>;

    disconnect(): Promise<void>;

    getAddress(): string | null;
}