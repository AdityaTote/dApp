import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

function Balance() {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [showForm, setShowForm] = useState(false);
  const [balance, setBalance] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000); // Clear message after 3 seconds

      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [message]);

  const handleClick = async () => {
    setShowForm(!showForm);
    if (!showForm) {
      if (wallet.publicKey === null) {
        setMessage({ text: "Please connect your wallet first", type: "error" });
        return;
      } else {
        try {
          const lamports = await connection.getBalance(wallet.publicKey);
          const intLamport = lamports / LAMPORTS_PER_SOL;
          setBalance(intLamport);
          if (lamports === 0) {
            setBalance(intLamport);
          } else {
            setMessage({ text: "", type: "" });
          }
        } catch (error) {
          setMessage({ text: "Error fetching balance", type: "error" });
        }
      }
    } else {
      setMessage({ text: "", type: "" });
    }
  };

  return (
    <div>
      <div className="mx-16">
        <button
          className="rounded-lg bg-blue-500 text-white px-4 py-2 same-width-btn"
          onClick={handleClick}
        >
          Balance
        </button>
      </div>
      <div className={`form-container ${showForm ? "show" : "hide"}`}>
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mx-14 my-4">
          <h1 className="text-xl font-bold text-gray-700">
            Your Balance: {balance} SOL
          </h1>
        </div>
      </div>
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
  );
}

export default Balance;
