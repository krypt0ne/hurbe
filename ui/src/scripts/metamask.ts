const Metamask = {
    async open(callback: (address: string) => void, onError?: (message: string) => void) {
        // @ts-ignore
        if (typeof ethereum === 'undefined') {
            if (onError) onError('Install metamask');
            return null;
        }

        try {
            // @ts-ignore
            const accounts = await ethereum.request({
                method: 'eth_requestAccounts', params: []
            });

            if (accounts.length > 0) {
                callback(accounts[0]);
            }

            await this.switchToHederaTestnet();
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    switchToHederaTestnet: async function () {
        try {
            // @ts-ignore
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x128' }], // Hedera Testnet chainId (decimal 296)
            });
        } catch (error: any) {
            if (error.code === 4902) { // Chain not added to wallet
                try {
                    // @ts-ignore
                    await ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [{
                            chainId: '0x128', // Hedera Testnet chainId (296 in decimal)
                            chainName: 'Hedera Testnet',
                            nativeCurrency: {
                                name: 'HBAR',
                                symbol: 'HBAR',
                                decimals: 18
                            },
                            blockExplorerUrls: ['https://hashscan.io/testnet'],
                            rpcUrls: ['https://testnet.hashio.io/api'],
                        }],
                    });
                } catch (error2) {
                    console.log('Error adding Hedera Testnet', error2);
                }
            } else {
                console.log('Error switching chain', error);
            }
        }        
    },

    addToMetamask: async function (address: string, symbol: string, image: string) {
        try {
            // @ts-ignore
            await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20',
                    options: {
                        address,
                        symbol,
                        decimals: '18',
                        image
                    },
                },
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
};

export default Metamask;