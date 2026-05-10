export const WalletConfig = {

    DEEPLINKS: {

        okx: (callback: string) =>
            `https://www.okx.com/download?deeplink=${callback}`,

        metamask: (callback: string) =>
            `https://metamask.app.link/dapp/${encodeURIComponent(callback)}`,

        tronlink: (callback: string) =>
            `https://link.tronlink.org/#/dapp/${callback}`
    }
};