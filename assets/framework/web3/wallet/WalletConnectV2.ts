import SignClient from "@walletconnect/sign-client";
import { IWallet } from "./IWallet";
import { openWallet } from "./DeepLink";

export class WalletConnectV2 implements IWallet {

    private client!: SignClient;
    private session: any;
    private address: string | null = null;

    async init() {
        this.client = await SignClient.init({
            projectId: "YOUR_PROJECT_ID",
            metadata: {
                name: "CocosGame",
                description: "Web3 Game",
                url: location.origin,
                icons: []
            }
        });
    }

    async connect(): Promise<string> {
        if (!this.client)
            await this.init();

        const { uri, approval } =
            await this.client.connect({
                requiredNamespaces: {
                    eip155: {
                        methods: ["personal_sign"],
                        chains: ["eip155:1"],
                        events: ["accountsChanged"]
                    }
                }
            });

        if (uri)
            openWallet(uri);

        this.session = await approval();

        const account =
            this.session.namespaces.eip155.accounts[0];

        this.address = account.split(":")[2];

        return this.address;
    }

    async sign(message: string): Promise<string> {
        return await this.client.request({
            topic: this.session.topic,
            chainId: "eip155:1",
            request: {
                method: "personal_sign",
                params: [message, this.address]
            }
        });
    }

    getAddress() {
        return this.address;
    }

    async disconnect() { }
}