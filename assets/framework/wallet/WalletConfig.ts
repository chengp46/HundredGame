export const WalletConfig = {

    CHAIN_ID: "0x1",

    DEEPLINKS: {
        okx(callback: string) {
            return `okx://wallet/dapp/url?dappUrl=${callback}`;
        },

        metamask(callback: string) {
            return `https://metamask.app.link/dapp/${encodeURIComponent(callback)}`;
        }
    }
};