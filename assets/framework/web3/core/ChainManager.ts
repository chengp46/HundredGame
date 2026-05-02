export class ChainManager {

    static async switch(chainIdHex: string) {

        const eth = (window as any).ethereum;

        await eth.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIdHex }]
        });
    }
}