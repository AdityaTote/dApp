import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

function SendTransaction() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [showForm, setShowForm] = useState(false);
  const [sender, setSender] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000); // Clear message after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [message]);

  const handleTransaction = async () => {
    try {
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(sender),
          lamports: Number(amount) * LAMPORTS_PER_SOL,
        })
      );

      const response = await wallet.sendTransaction(transaction, connection);

      if (response) {
        console.log("Transaction sent: ", response);
        setMessage({ text: "Transaction sent", type: "success" });
      } else {
        setMessage({ text: "Transaction failed", type: "error" });
      }
    } catch (error) {
      console.error("Transaction error: ", error);
      setMessage({ text: "Transaction failed", type: "error" });
    }
  };

  const handleClick = () => {
    setShowForm(!showForm);
    if (!showForm && !wallet.publicKey) {
      setMessage({ text: "Please connect your wallet first", type: "error" });
    } else if (showForm) {
      setMessage({ text: "", type: "" });
    }
  };

  return (
    <div>
      <div className="mx-48">
        <button
          className="rounded-lg bg-blue-500 text-white px-4 py-2 same-width-btn"
          onClick={handleClick}
        >
          Send Transaction
        </button>
      </div>
      <div className={`form-container ${showForm ? "show" : "hide"}`}>
        <input
          type="text"
          placeholder="Enter the sender address"
          className="rounded-lg border border-gray-300 px-4 py-2 mx-5 my-5"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter the amount of Solana you have to transfer"
          className="rounded-lg border border-gray-300 px-2 py-2"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="rounded-lg bg-blue-500 text-white px-4 py-2 mx-5"
          onClick={handleTransaction}
        >
          Submit
        </button>
        {message.text && (
          <div
            className={`mx-14 my-4 p-4 rounded-lg ${
              message.type === "error"
                ? "bg-red-500 text-white"
                : "bg-green-500 text-white"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}

export default SendTransaction;
