import { useWallet } from "@solana/wallet-adapter-react";
import React, { useEffect, useState } from "react";
import { ed25519 } from '@noble/curves/ed25519';
import bs58 from 'bs58';

function Sign() {
  const { publicKey, signMessage } = useWallet();
  const [showForm, setShowForm] = useState(false);
  const [response, setResponse] = useState({ text: "", type: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (response.text) {
      const timer = setTimeout(() => {
        setResponse({ text: "", type: "" });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [response]);

  const handleClick = () => {
    setShowForm(!showForm);
    if (!showForm && !publicKey) {
      setResponse({ text: "Please connect your wallet first", type: "error" });
    } else if (showForm) {
      setResponse({ text: "", type: "" });
    }
  };

  const handleMsgSign = async () => {
    if (!signMessage) {
      setResponse({ text: 'Wallet does not support message signing!', type: 'error' });
      return;
    }
    const encodedMessage = new TextEncoder().encode(message);
    const signature = await signMessage(encodedMessage);

    if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
      setResponse({ text: 'Message signature invalid!', type: 'error' });
    } else {
      setResponse({ text: `Message signed successfully! Signature: ${bs58.encode(signature)}`, type: 'success' });
      setMessage("");
    }
  };

  return (
    <div>
      <div className="mx-24">
        <button
          className="rounded-lg bg-blue-500 text-white px-4 py-2 same-width-btn"
          onClick={handleClick}
        >
          Sign
        </button>
      </div>
      <div className={`form-container ${showForm ? "show" : "hide"}`}>
        <input
          type="text"
          placeholder="Enter the message to sign"
          className="rounded-lg border border-gray-300 px-4 py-2 mx-5 my-5"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="rounded-lg bg-blue-500 text-white px-4 py-2 mx-5"
          onClick={handleMsgSign}
        >
          Submit
        </button>
      </div>
      {response.text && (
        <div className={`mx-14 mt-4 ${response.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {response.text}
        </div>
      )}
    </div>
  );
}

export default Sign;