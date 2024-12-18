import { hederaTestnet } from "viem/chains";
import { walletConnect } from "@wagmi/connectors";
import { defaultWagmiConfig } from "@web3modal/wagmi";

const metadata = {
  name: "Hurbe",
  description: "Hurbe",
  url: "https://hurbe.xyz",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

export const chains = [hederaTestnet];

export const config = defaultWagmiConfig({
  // @ts-ignore
  chains,
  projectId: import.meta.env.VITE_PROJECT_ID,
  metadata,
  connectors: [
    walletConnect({
      projectId: import.meta.env.VITE_PROJECT_ID,
    }),
  ],
});
