import React from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import {
  AirDrop,
  Sign,
  Balance,
  Header,
} from "./components/index.components.js";
import SendTransaction from "./components/SendTransaction.jsx";

function App() {
  return (
    <>
      <Header />
      <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
        <WalletProvider wallets={[]} autoConnect>
          <WalletModalProvider>
            <div className="flex justify-center my-24">
              <div>
                <WalletMultiButton />
              </div>
              <div className="mx-5">
                <WalletDisconnectButton />
              </div>
            </div>
            <div className="flex justify-center my-5">
              <AirDrop />
            </div>
            <div className="flex justify-center my-5">
              <Balance />
            </div>
            <div className="flex justify-center my-5">
              <Sign />
            </div>
            <div className="flex justify-center my-5">
              <SendTransaction />
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
