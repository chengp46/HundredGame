export class WalletSession {

    static save(addr: string) {
        localStorage.setItem("wallet_addr", addr);
    }

    static get() {
        return localStorage.getItem("wallet_addr");
    }

    static clear() {
        localStorage.removeItem("wallet_addr");
    }
}