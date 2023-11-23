"use client";

import { Sepolia } from "@thirdweb-dev/chains";
import {
  ThirdwebProvider,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
} from "@thirdweb-dev/react";
import { StateContextProvider } from "../context";
import { Navbar, Sidebar } from "../components";
import "../../styles/globals.css";

export default function RootLayout({ children }) {
  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId="b648be5f88b4c0cafb37ca096539abe4"
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        coinbaseWallet(),
        walletConnect(),
      ]}
    >
      <StateContextProvider>
        <html lang="en">
          <head>
            <title>Kickstarter Clone</title>
          </head>
          <body className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
            {/* SIDEBAR */}
            <div className="sm:flex hidden mr-10 relative">
              <Sidebar />
            </div>

            {/* MAIN CONTENT AND NAVBAR */}
            <div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
              <Navbar />
              <div>{children}</div>
            </div>
          </body>
        </html>
      </StateContextProvider>
    </ThirdwebProvider>
  );
}
