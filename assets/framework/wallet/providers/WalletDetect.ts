export class WalletDetect {

    static isMobile() {
        return /Android|iPhone|iPad/i.test(navigator.userAgent);
    }

    static hasEthereum(): boolean {
        return typeof (window as any).ethereum !== "undefined";
    }

    static isMetaMask(): boolean {
        return (window as any).ethereum?.isMetaMask;
    }

    static isOKX(): boolean {
        return (window as any).okxwallet !== undefined;
    }

    static getProvider(): any {
        const w: any = window;

        if (w.ethereum) return w.ethereum;
        if (w.okxwallet) return w.okxwallet;

        return null;
    }

    static canInjected(): boolean {
        return this.hasEthereum() || this.isOKX();
    }
}