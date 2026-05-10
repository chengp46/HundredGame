export class WalletDetect {

    static getInjected(): any {
        const w: any = window;

        if (w.okxwallet) return w.okxwallet;
        if (w.ethereum) return w.ethereum;
        if (w.tronWeb) return w.tronWeb;

        return null;
    }

    static hasInjected(): boolean {
        return !!this.getInjected();
    }

    static isMobile(): boolean {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
}