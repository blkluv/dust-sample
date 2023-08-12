import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import localFont from "next/font/local";
import { MetaMaskConnector } from "@wagmi/core/connectors/metaMask";
import { ChainProviderFn } from "@wagmi/core";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";

import { BoxEvmChains } from "@decent.xyz/the-box";
import "@decent.xyz/the-box/dist/the-box-base.css";
import "@decent.xyz/the-box/dist/dark.css";
import "@decent.xyz/the-box/dist/font.woff2.css";

const getAlchemyProviders = (): ChainProviderFn[] => {
  const providers: ChainProviderFn[] = [];
  const apiKeys = [
    process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_KEY,
    process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_KEY,
    process.env.NEXT_PUBLIC_OPTIMISM_MAINNET_KEY,
    process.env.NEXT_PUBLIC_POLYGON_MAINNET_KEY,
  ];
  for (const apiKey of apiKeys) {
    if (apiKey) {
      providers.push(alchemyProvider({ apiKey }));
    }
  }
  return providers;
};

const { chains, publicClient } = configureChains(BoxEvmChains, [
  // @ts-ignore
  ...getAlchemyProviders(),

  // @ts-ignore
  publicProvider(),
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  publicClient,
});

export const monument = localFont({
  src: "../fonts/EduMonumentGroteskVariable.woff2",
  variable: "--font-monument",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <div
          className={`${monument.variable} font-sans flex flex-col min-h-screen bg-gradient-conic`}
        >
          <Component {...pageProps} />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
