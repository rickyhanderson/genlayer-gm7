"use client";

import { useState } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xe5D10BDBFFC1f0E807BD2b9f43cA9f66c0b5a15A";
const ABI = ["function genm() external"];

// Ganti kalau GenLayer ganti chain
const GENLAYER_CHAIN = {
  chainId: "0x45F", // contoh, sesuaikan kalau beda
  chainName: "GenLayer Testnet",
  rpcUrls: ["https://genlayer-testnet.rpc2.caldera.xyz/http"],
  nativeCurrency: {
    name: "GEN",
    symbol: "GEN",
    decimals: 18,
  },
};

export default function Home() {
  const [wallet, setWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function connectWallet() {
    if (!(window as any).ethereum) {
      alert("MetaMask belum terpasang");
      return;
    }

    const provider = new ethers.BrowserProvider(
      (window as any).ethereum
    );

    // auto switch network
    try {
      await (window as any).ethereum.request({
        method: "wallet_addEthereumChain",
        params: [GENLAYER_CHAIN],
      });
    } catch {}

    const accounts = await provider.send(
      "eth_requestAccounts",
      []
    );
    setWallet(accounts[0]);
  }

  function disconnectWallet() {
    setWallet(null);
  }

  async function handleGENM() {
    if (!wallet) {
      alert("Connect wallet dulu");
      return;
    }

    try {
      setLoading(true);

      const provider = new ethers.BrowserProvider(
        (window as any).ethereum
      );
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI,
        signer
      );

      const tx = await contract.genm();
      await tx.wait();

      alert("GENM sukses ✅ Onchain");
    } catch (e: any) {
      alert(
        e?.reason ||
          e?.message ||
          "RPC sedang padat, coba lagi nanti"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        {/* LEFT */}
        <div>
          <h1 className="text-xl font-bold">GenLayer</h1>
          <p className="text-xs text-white/50">
            Trust Infrastructure for the AI Age
          </p>
        </div>

        {/* RIGHT */}
        {wallet ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/60">
              {wallet.slice(0, 6)}…{wallet.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        )}
      </header>

      {/* CONTENT */}
      <section className="flex flex-col items-center justify-center text-center mt-32">
        <h2 className="text-5xl font-extrabold rgb-text mb-4">
          Welcome Gen Onchain
        </h2>

        <p className="text-white/50 mb-6">
          Leaderboard: Not Available
        </p>

        <button
          disabled={loading}
          onClick={handleGENM}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-pink-500 via-blue-500 to-red-500 hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Processing…" : "GENM"}
        </button>

        <p className="mt-4 text-sm text-white/40">
          1x per wallet per day · Onchain
        </p>
      </section>

      {/* STYLE */}
      <style jsx>{`
        .rgb-text {
          background: linear-gradient(
            90deg,
            #ff0080,
            #00bfff,
            #ff0000,
            #ff0080
          );
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: rgb 4s linear infinite;
        }

        @keyframes rgb {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
      `}</style>
    </main>
  );
}
