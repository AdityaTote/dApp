import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import React, { useState, useEffect } from "react";

function AirDrop() {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000); // Clear message after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [message]);

  async function handleRequestAirDrop() {
    try {
      if (amount === "") {
        setMessage({ text: "Please enter the amount of Solana you have to transfer", type: "error" });
      } else if (isNaN(amount)) {
        setMessage({ text: "Please enter a valid number", type: "error" });
      } else {
        const intAmount = parseInt(amount);
        await connection.requestAirdrop(
          wallet.publicKey,
          intAmount * LAMPORTS_PER_SOL
        );
        setMessage({ text: `Airdrop of ${intAmount} SOL requested`, type: "success" });
        setAmount("");
      }
    } catch (error) {
      setAmount("");
      console.log(error);
      setMessage({ text: "Error requesting airdrop", type: "error" });
    }
  }

  const handleClick = () => {
    setShowForm(!showForm);
    if (!showForm && wallet.publicKey === null) {
      setMessage({ text: "Please connect your wallet first", type: "error" });
    } else if (showForm) {
      setMessage({ text: "", type: "" });
    }
  };

  return (
    <div>
      <div className="mx-20">
        <button
          className="rounded-lg bg-blue-500 text-white px-4 py-2 same-width-btn"
          onClick={handleClick}
        >
          AirDrop
        </button>
      </div>
      <div className={`form-container ${showForm ? "show" : "hide"}`}>
        <input
          type="text"
          placeholder="Enter the amount of Solana you have to transfer"
          className="rounded-lg border border-gray-300 px-4 py-2 mx-5 my-5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button
          className="rounded-lg bg-blue-500 text-white px-4 py-2 mx-5"
          onClick={handleRequestAirDrop}
        >
          Drop
        </button>
      </div>
      {message.text && (
        <div className={`mx-14 my-4 p-4 rounded-lg ${message.type === "error" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
}

export default AirDrop;